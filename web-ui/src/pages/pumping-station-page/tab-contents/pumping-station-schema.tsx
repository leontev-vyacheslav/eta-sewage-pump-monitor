import { useEffect } from 'react';
import './pumping-station-schema.scss';
import { usePumpingStationPage } from '../pumping-station-page-context';

export const PumpingStationSchema = () => {
    const { pumpingStationObjectState } = usePumpingStationPage();


    useEffect(() => {
        const dumpWaterElement = document.querySelector('#dump-water');
        const dumpBottomElement = document.querySelector('#dump-bottom')

        if (!dumpBottomElement || !dumpWaterElement || !pumpingStationObjectState) {
            return;
        }

        const dumpBottomY = dumpBottomElement.getAttribute('y')!;

        const setDumpWaterHeigh = (sensorName: string) => {
            const targetY = document.querySelector(`#${sensorName} circle`)!.getAttribute('cy')!;
            dumpWaterElement.setAttribute('y', targetY);
            dumpWaterElement.setAttribute('height', (parseFloat(dumpBottomY) - parseFloat(targetY)).toString());
        }

        if (pumpingStationObjectState.lowLevel) {
            setDumpWaterHeigh('low-level-sensor');
        }

        if (pumpingStationObjectState.midLevel) {
            setDumpWaterHeigh('middle-level-sensor');
        }

        if (pumpingStationObjectState.hiLevel) {
            setDumpWaterHeigh('high-level-sensor');
        }

        if (pumpingStationObjectState.emergencyLevel) {
            setDumpWaterHeigh('emergency-level-sensor');
        }

    }, [pumpingStationObjectState]);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 379 638.04" height="600">
            <defs>
                <filter id="b" data-name="drop-shadow-1" filterUnits="userSpaceOnUse">
                    <feOffset dx="2" dy="2" />
                    <feGaussianBlur result="c" stdDeviation="3" />
                    <feFlood floodColor="#000" floodOpacity=".75" />
                    <feComposite in2="c" operator="in" />
                    <feComposite in="SourceGraphic" />
                </filter>
                <pattern id="d" data-name="10 lpi 10%" x="0" y="0" width="72" height="72" patternTransform="translate(3206.15 -7921.49) rotate(-45)" patternUnits="userSpaceOnUse" viewBox="0 0 72 72">
                    <g>
                        <rect width="72" height="72" fill="none" />
                        <g>
                            <line x1="71.75" y1="68.4" x2="144.25" y2="68.4" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="54" x2="144.25" y2="54" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="39.6" x2="144.25" y2="39.6" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="25.2" x2="144.25" y2="25.2" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="10.8" x2="144.25" y2="10.8" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="61.2" x2="144.25" y2="61.2" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="46.8" x2="144.25" y2="46.8" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="32.4" x2="144.25" y2="32.4" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="18" x2="144.25" y2="18" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="71.75" y1="3.6" x2="144.25" y2="3.6" fill="none" stroke="#231f20" strokeWidth=".72" />
                        </g>
                        <g>
                            <line x1="-.25" y1="68.4" x2="72.25" y2="68.4" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="54" x2="72.25" y2="54" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="39.6" x2="72.25" y2="39.6" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="25.2" x2="72.25" y2="25.2" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="10.8" x2="72.25" y2="10.8" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="61.2" x2="72.25" y2="61.2" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="46.8" x2="72.25" y2="46.8" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="32.4" x2="72.25" y2="32.4" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="18" x2="72.25" y2="18" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-.25" y1="3.6" x2="72.25" y2="3.6" fill="none" stroke="#231f20" strokeWidth=".72" />
                        </g>
                        <g>
                            <line x1="-72.25" y1="68.4" x2=".25" y2="68.4" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="54" x2=".25" y2="54" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="39.6" x2=".25" y2="39.6" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="25.2" x2=".25" y2="25.2" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="10.8" x2=".25" y2="10.8" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="61.2" x2=".25" y2="61.2" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="46.8" x2=".25" y2="46.8" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="32.4" x2=".25" y2="32.4" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="18" x2=".25" y2="18" fill="none" stroke="#231f20" strokeWidth=".72" />
                            <line x1="-72.25" y1="3.6" x2=".25" y2="3.6" fill="none" stroke="#231f20" strokeWidth=".72" />
                        </g>
                    </g>
                </pattern>
                <pattern id="e" data-name="10 lpi 10%" patternTransform="translate(3179.01 -7944.82) rotate(-45)" xlinkHref="#d" />
                <pattern id="f" data-name="10 lpi 10%" patternTransform="translate(-7791.26 3203.45) rotate(45)" xlinkHref="#d" />
                <pattern id="g" data-name="10 lpi 10%" patternTransform="translate(-7817.48 3175.69) rotate(45)" xlinkHref="#d" />
                <pattern id="h" data-name="10 lpi 10%" patternTransform="translate(-7803.23 3183.46) rotate(45)" xlinkHref="#d" />
                <filter id="i" data-name="drop-shadow-2" filterUnits="userSpaceOnUse">
                    <feOffset dx="2" dy="2" />
                    <feGaussianBlur result="j" stdDeviation="3" />
                    <feFlood floodColor="#000" floodOpacity=".75" />
                    <feComposite in2="j" operator="in" />
                    <feComposite in="SourceGraphic" />
                </filter>
            </defs>
            <rect x="80" y="7.04" width="218.25" height="594.5" fill="#d1d3d4" filter="url(#b)" />
            <rect x="44.5" y="26.54" width="35" height="576" fill="url(#d)" stroke="#231f20" strokeMiterlimit="10" />
            <rect x="299.5" y="26.54" width="35" height="576" fill="url(#e)" stroke="#231f20" strokeMiterlimit="10" />

            <rect id="dump-bottom" x="44.5" height="35" stroke="#231f20" strokeMiterlimit="10" y="602.54" fill="url(#g)" width="290" />

            <rect x="299.5" y="7.54" width="79" height="19" fill="url(#g)" stroke="#231f20" strokeMiterlimit="10" />
            <rect x=".5" y="7.54" width="79" height="19" fill="url(#h)" stroke="#231f20" strokeMiterlimit="10" />
            <rect id="dump-water" x="80.25" y="555.04" width="218.25" height="46.01" fill="#808285" filter="url(#i)" />

            <g id="pump-1">
                <path d="m159.5,602.54h-73c6.33-6.67,12.67-13.33,19-20h36c6,6.67,12,13.33,18,20Z" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                <rect x="104.5" y="529.54" width="19" height="47.5" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                <circle cx="124" cy="573.04" r="20.5" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                <line x1="124" y1="573.54" x2="144" y2="573.54" fill="#231f20" stroke="#939598" strokeMiterlimit="10" />
                <line x1="123.5" y1="552.54" x2="123.5" y2="573.54" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="123.25" y1="574.29" x2="137.75" y2="559.79" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="123.5" y1="572.04" x2="123.5" y2="593.04" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="103" y1="573.54" x2="123" y2="573.54" fill="#231f20" stroke="#939598" strokeMiterlimit="10" />
                <line x1="109.39" y1="588.2" x2="123.9" y2="573.7" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="123.39" y1="572.7" x2="108.3" y2="558.79" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="138.39" y1="586.7" x2="123.3" y2="572.79" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <circle cx="123.69" cy="573" r="4.54" fill="#939598" />
                <rect x="99.5" y="524.54" width="28" height="6" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
            </g>
            <g id="pump-2">
                <path d="m249.09,602.6h-73c6.33-6.67,12.67-13.33,19-20h36c6,6.67,12,13.33,18,20Z" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                <rect x="194.09" y="529.6" width="19" height="47.5" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                <circle cx="213.59" cy="573.1" r="20.5" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                <line x1="213.59" y1="573.6" x2="233.59" y2="573.6" fill="#231f20" stroke="#939598" strokeMiterlimit="10" />
                <line x1="213.09" y1="552.6" x2="213.09" y2="573.6" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="212.84" y1="574.36" x2="227.35" y2="559.85" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="213.09" y1="572.1" x2="213.09" y2="593.1" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="192.59" y1="573.6" x2="212.59" y2="573.6" fill="#231f20" stroke="#939598" strokeMiterlimit="10" />
                <line x1="198.98" y1="588.27" x2="213.49" y2="573.76" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="212.98" y1="572.76" x2="197.89" y2="558.85" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <line x1="227.98" y1="586.76" x2="212.89" y2="572.85" fill="none" stroke="#939598" strokeMiterlimit="10" />
                <circle cx="213.28" cy="573.06" r="4.54" fill="#939598" />
                <rect x="189.09" y="524.6" width="28" height="6" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
            </g>

            <g id="low-level-sensor">
                <g>
                    <rect x="289.5" y="530.54" width="71" height="10" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                    <circle cx="269" cy="543.04" r="12.5" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                </g>
                <line x1="280.5" y1="537.54" x2="289.5" y2="535.54" fill="none" stroke="#231f20" strokeMiterlimit="10" />
            </g>

            <g id="middle-level-sensor">
                <g>
                    <rect x="289.5" y="386.54" width="71" height="10" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                    <circle cx="269" cy="399.04" r="12.5" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                </g>
                <line x1="280.5" y1="393.54" x2="289.5" y2="391.54" fill="none" stroke="#231f20" strokeMiterlimit="10" />
            </g>

            <g id="high-level-sensor">
                <g>
                    <rect x="289.5" y="242.54" width="71" height="10" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                    <circle cx="269" cy="255.04" r="12.5" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                </g>
                <line x1="280.5" y1="249.54" x2="289.5" y2="247.54" fill="none" stroke="#231f20" strokeMiterlimit="10" />
            </g>

            <g id="emergency-level-sensor">
                <g>
                    <rect x="289.5" y="98.54" width="71" height="10" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                    <circle cx="269" cy="111.04" r="12.5" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                </g>
                <line x1="280.5" y1="105.54" x2="289.5" y2="103.54" fill="none" stroke="#231f20" strokeMiterlimit="10" />
            </g>

            <text transform="translate(99.9 517.39)" fill="#231f20" fontFamily="MyriadPro-Regular, 'Myriad Pro'" fontSize="12"><tspan x="0" y="0">На</tspan><tspan x="13.61" y="0" letterSpacing="0em">с</tspan><tspan x="18.91" y="0" letterSpacing="0em">ос 1</tspan></text>
            <text transform="translate(188.15 516.76)" fill="#231f20" fontFamily="MyriadPro-Regular, 'Myriad Pro'" fontSize="12"><tspan x="0" y="0">На</tspan><tspan x="13.61" y="0" letterSpacing="0em">с</tspan><tspan x="18.91" y="0" letterSpacing="0em">ос 2</tspan></text>
        </svg>
    );
}