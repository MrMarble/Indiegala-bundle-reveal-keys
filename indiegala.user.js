// ==UserScript==
// @name         Indiegala Bundle Revealer
// @namespace    https://github.com/MrMarble/Indiegala-bundle-reveal-keys
// @version      0.1
// @description  Adds a button to reveal and copy all the game keys of a bundle
// @author       MrMarble
// @updateURL    https://raw.githubusercontent.com/MrMarble/Indiegala-bundle-reveal-keys/master/indiegala.user.js
// @downloadURL  https://raw.githubusercontent.com/MrMarble/Indiegala-bundle-reveal-keys/master/indiegala.user.js
// @match        https://www.indiegala.com/gift-bundle/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let _copy = window.verifyGiftPassword;
    let gList;
    const btn = (()=> {
        let el = document.createElement('template');
        el.innerHTML = `<li class="profile-private-page-library-subitem">
                       <a class="bg-gradient-red" href="#" style="width: 100%;display: block;text-align: center;padding: 5px 0;font-size: 20px;border-radius: 7px;">Reveal all keys</a>
                   </li>`;
        return el.content.firstChild;
    })()

    window.verifyGiftPassword = function(...args) {
        $(document).ajaxSuccess(function cb(_, __, settings) {
            if (settings.url == '/gift-bundle/verify') {
                $(document).off('ajaxSuccess', null, cb);
                gList = document.querySelector('ul[id^=bundle]');
                btn.querySelector('a').addEventListener('click', revealAll);
                gList.insertBefore(btn, gList.firstChild);
            }
        });
        _copy(...args);
    }
    function revealAll() {
        gList.querySelectorAll('li:not(:first-child)').forEach((game)=> {
            if (getComputedStyle(game.querySelector('input.profile-private-page-library-key-serial')).display == 'none') {
                let key = game.querySelector('div.profile-private-page-library-serial-dialog')
                key.style.display = 'block';
                getSerialKeyGo = true;
                key.querySelector('button.profile-private-page-library-get-serial-btn').click()
            }
        })
        btn.querySelector('a').innerText = 'Copy all Keys';
        btn.querySelector('a').addEventListener('click', copyAll);
        btn.querySelector('a').removeEventListener('click', revealAll);
    }

    function copyAll() {
        let keys= [...gList.querySelectorAll('input.profile-private-page-library-key-serial')].map(el => el.value).join(' ');
        let textArea= document.createElement("textarea");
        textArea.value = keys;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');

        document.body.removeChild(textArea);
        btn.querySelector('a').innerText = 'All keys Copied!';
    }
})();