<?php
return [
	'[texture]' => '<style>
.rules-checker {display: flex;flex-flow: column;}
.rules-checker textarea{overflow-x: hidden; padding: 1rem; box-sizing: border-box; height: 10rem;}
.rules-checker select {box-sizing: border-box; overflow: hidden; flex: 1 1 100%;}
.rules-checker select+div {display: flex; flex-flow: row wrap; justify-content: center; padding: 1rem;}
#info strong {font-size: 1.2rem;}
</style>
    <div class="rules-checker">
        <textarea id="hairy"></textarea>
        <div><p id="info">Rezultatul verificărilor va fi afișat aici.</p></div>
        <select id="rules">
            <option value="-1">alegeți tipul de verificare</option>
            <optgroup label="Erori de virgulă">
                <option value="0">spațiu înainte de virgulă</option>
                <option value="1">lipsă spațiu dupa virgulă (exclude numerele)</option>
                <option value="2">virgulă spațiată, doar în numere</option>
            </optgroup>
            <optgroup label="Paranteze">
                <option value="3">paranteze cu spațiu intern</option>
                <option value="4">paranteze cu spațiu extern</option>
            </optgroup>
            <optgroup label="Semne de exclamare/întrebare">
                <option value="5">exclamare/întrebare cu spații</option>
                <option value="6">exclamare/întrebare — mai mult de două</option>
            </optgroup>
            <optgroup label="Punctul">
                <option value="7">punct separat de textul ce-l precede</option>
                <option value="8">punct urmat direct de literă</option>
                <option value="9">punct urmat de spații la capat de paragraf</option>
                <option value="10">punct zecimal ce ar trebui să fie virgulă</option>
                <option value="11">punct zecimal spațiat, doar în numere</option>
            </optgroup>
            <optgroup label="Două puncte">
                <option value="12">două puncte cu spații înainte</option>
                <option value="13">două puncte cu spații multiple</option>
                <option value="14">două puncte fără spații</option>
            </optgroup>
            <optgroup label="Puncte de suspensie">
                <option value="15">puncte de suspensie cu spații înainte</option>
                <option value="16">puncte de suspensie fără spațiu după</option>
                <option value="17">puncte de suspensie diferite de trei</option>
                <option value="18">puncte de suspensie cu spații între</option>
                <option value="19">puncte de suspensie cu spații după</option>
            </optgroup>
            <optgroup label="Linia de dialog">
                <option value="20">dialog spații înainte</option>
                <option value="21">dialog spații multiple dupa</option>
                <option value="22">dialog fără spațiu după</option>
                <option value="23">dialog semn grafic neconform</option>
            </optgroup>
            <optgroup label="Bara oblică">
                <option value="24">bara oblică cu spații</option>
            </optgroup>
            <optgroup label="Apostrof">
                <option value="25">apostrof învecinat cu spații</option>
                <option value="26">apostrof dublat/multiplicat</option>
            </optgroup>
            <optgroup label="Ghilimele">
                <option value="27">ghilimele drepte (englezești)</option>
                <option value="28">simulare ghilimele prin virgule</option>
                <option value="29">ghilime sus la început de citat</option>
            </optgroup>
            <optgroup label="Spațiu alb">
                <option value="30">spații la inceput de paragraf</option>
                <option value="31">spații la sfarsit de paragraf</option>
                <option value="32">spații multiple consecutive</option>
                <option value="33">paragrafe goale</option>
            </optgroup>
        </select>
        <div>
            <button id="lightprev" class="btn"><< precedenta</button>
            <button id="lightnext" class="btn">următoarea >></button>
        </div>
    </div>
    <script async src="/js/ws.min.js"></script>'
];
