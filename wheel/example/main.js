require('./css/main.scss');

import FlavorWheel from '../src/flavor-wheel';


window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const jsonMap = [];
    for (const [key, value] of urlParams) {
        let jsonNode = {};
        jsonNode[key] = value;
        jsonMap.push(jsonNode);
    }

    const mapValue = jsonMap.map(obj => {
        const key = Object.keys(obj)[0];
        return { label: key, value: obj[key] };
    });
    const CATEGORIES = mapValue.map(({ label }) => label);
    const wheel = FlavorWheel.initialize("#d3wheel", {
        maxRating: 5,
        gridRadius: 250,
        viewWidth: 800,
        labels: CATEGORIES
    });
    // `data` is now a JavaScript object containing the JSON data from the file
    wheel.addData(mapValue, '1');
};
