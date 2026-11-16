"""Validate user flows on the built static site, including a repository subpath."""
import functools
import os
from pathlib import Path
import shutil
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test-results'
OUT.mkdir(exist_ok=True)


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


# Serve from the parent to exercise /processarium/dist/ rather than only /.
server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(ROOT.parent)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/{ROOT.name}/dist/'

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'), args=['--no-sandbox'])
        context = browser.new_context(viewport={'width':1440,'height':1050}, reduced_motion='reduce')
        page = context.new_page()
        errors = []
        requests = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('request', lambda r: requests.append(r.url))
        page.goto(base)
        page.wait_for_selector('#guide-list .guide-button')
        ids = ['publication','reponse','reunion','comparatif','calque','coachos','eclipse']
        for i, name in enumerate(ids):
            level = 0 if i < 2 else 1 if i < 4 else 2
            page.locator(f'[data-level="{level}"]').click()
            page.locator('#guide-picker').select_option(name, force=True)
            count = 3 if level == 0 else 4 if level == 1 else 5
            for _ in range(count):
                page.locator('#next').click()
            assert page.locator('#next').inner_text() == 'Terminer le guide', name
            before = page.locator('#elapsed').inner_text()
            page.locator('#correct').click()
            assert page.locator('#elapsed').inner_text() == before
            assert page.locator('#next').inner_text() == 'Appliquer la correction'
            page.locator('#next').click()
            assert page.locator('#next').inner_text() == 'Vérifier à nouveau'
            page.locator('#next').click()
            page.locator('#next').click()
            assert page.locator('#next').inner_text() == 'Guide terminé ✓'
        page.locator('#collection-toggle').click()
        assert page.locator('#collection-summary').inner_text() == '7/7 guides terminés · 11/11 personnages rencontrés'
        page.keyboard.press('Escape')
        assert not page.locator('#collection-dialog').is_visible()
        page.reload()
        page.wait_for_selector('#guide-list .guide-button')
        assert page.locator('#collection-count').inner_text() == '7'
        # Branches change actual simulated work rather than just their label.
        page.locator('#guide-picker').select_option('calque', force=True)
        times = {}
        for mode in ['text','scan','mixed']:
            page.locator('#replay').click()
            page.locator('#pdf-type').select_option(mode)
            for _ in range(5):
                page.locator('#next').click()
            times[mode] = int(page.locator('#elapsed').inner_text().split()[0])
        assert times['text'] < times['mixed'] < times['scan'], times
        # Auto-play stops at a human checkpoint rather than collecting for them.
        page.locator('#replay').click()
        page.locator('#play').click()
        page.wait_for_function("document.getElementById('next').textContent === 'Confirmer la relecture'", timeout=15000)
        assert page.locator('#play').get_attribute('aria-pressed') == 'false'
        page.locator('#next').click()
        assert page.locator('#next').inner_text() == 'Terminer le guide'
        # Start with a fresh workspace for screenshots.
        page.evaluate('localStorage.clear()')
        page.reload()
        page.wait_for_selector('#guide-list .guide-button')
        page.locator('[data-level="2"]').click()
        page.locator('#guide-picker').select_option('eclipse', force=True)
        page.screenshot(path=str(OUT/'desktop.png'), full_page=True)
        for width in [320,390,700,1024,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            for level in [0,1,2]:
                page.locator(f'[data-level="{level}"]').click()
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width,level,page.evaluate("Array.from(document.querySelectorAll('body *')).filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>[e.tagName,e.className,e.getBoundingClientRect().right]).slice(0,15)"))
            if width == 390:
                page.screenshot(path=str(OUT/'mobile.png'), full_page=True)
        # Test animated transitions, cancellation and real pause controls.
        page.emulate_media(reduced_motion='no-preference')
        page.locator('[data-level="0"]').click()
        page.locator('#play').click()
        page.wait_for_function("document.getElementById('map-caption').textContent === 'Le dossier circule…'")
        page.locator('#play').click()
        assert page.locator('#play').get_attribute('aria-pressed') == 'false'
        page.wait_for_timeout(1900)
        assert page.locator('#step-status').inner_text() == '0/3 étapes', 'Pause must stop the current transition'
        page.locator('[data-level="2"]').click()
        page.wait_for_timeout(2000)
        assert page.locator('#step-status').inner_text() == '0/5 étapes'
        page.locator('#zoom-in').click()
        page.locator('#zoom-reset').click()
        assert not errors, errors
        assert all(urlsplit(url).netloc == urlsplit(base).netloc for url in requests), requests
        # Inaccessible storage falls back to an honest in-memory session.
        fallback = context.new_page()
        fallback.add_init_script("Object.defineProperty(window, 'localStorage', {get(){throw new Error('storage unavailable')}})")
        fallback.goto(base)
        fallback.wait_for_selector('#guide-list .guide-button')
        fallback.locator('#collection-toggle').click()
        assert 'onglet seulement' in fallback.locator('#storage-note').inner_text()
        preview = context.new_page()
        preview.add_init_script("localStorage.removeItem('processarium:v1')")
        preview.on('pageerror', lambda e: errors.append(str(e)))
        preview.goto(base+'preview.html')
        preview.wait_for_selector('#guide-list .guide-button')
        preview.locator('#next').click()
        assert preview.locator('#step-status').inner_text() == '1/3 étapes'
        assert not errors, errors
        browser.close()
        print('OK: seven guides, corrections, human checkpoints, saved collection, PDF branches, 5 viewport widths, animated cancellation, storage fallback, repository subpath, no external requests or JS errors.')
        print('Simulated PDF durations:', times)
finally:
    server.shutdown()
