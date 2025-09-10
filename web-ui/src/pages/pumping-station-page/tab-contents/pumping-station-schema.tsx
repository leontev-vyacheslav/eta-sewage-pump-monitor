import { useCallback, useEffect } from 'react';
import { usePumpingStationPage } from '../pumping-station-page-context';
import { formatMessage } from 'devextreme/localization';
import { useScreenSize } from '../../../utils/media-query';

import './pumping-station-schema.scss';
import { EmergencyLevel, PumpingStationIcon, StopIcon2 } from '../../../constants/app-icons';

export const PumpingStationSchema = () => {
    const { pumpingStationObjectState } = usePumpingStationPage();
    const { isXSmall } = useScreenSize();


    const startStopPumpsHandler = useCallback(() => {
        if (!pumpingStationObjectState) {
            return;
        }
        const changeHighlightStroke = (blades: NodeListOf<SVGLineElement> | undefined, color: string) => {
            blades && Array.from(blades).forEach(b => {
                b.setAttribute('stroke', color);
            });
        }
        const pumpBladesGroupNumber = [1, 2];
        pumpBladesGroupNumber.forEach(i => {
            const pumpBlades = document.querySelector(`#pump-${i}-blades`);

            const pumpBladesAnimation = pumpBlades?.querySelector('animateTransform') as SVGAnimateElement;
            const blades: NodeListOf<SVGLineElement> | undefined = pumpBlades?.querySelectorAll('line');

            if (!pumpingStationObjectState.startStop) {
                changeHighlightStroke(blades, '#939598');
                pumpBladesAnimation?.endElement();
                return;
            }

            if (pumpingStationObjectState[`statePump${i}`]) {
                changeHighlightStroke(blades, '#fefefe');
                pumpBladesAnimation?.beginElement();
            } else {
                changeHighlightStroke(blades, '#939598');
                pumpBladesAnimation?.endElement();
            }
        });
    }, [pumpingStationObjectState]);

    const levelSensorsHandler = useCallback(() => {
        const dumpWaterElement = document.querySelector('#dump-water');
        const dumpBottomElement = document.querySelector('#dump-bottom')

        if (!dumpBottomElement || !dumpWaterElement || !pumpingStationObjectState) {
            return;
        }

        const dumpBottomY = dumpBottomElement.getAttribute('y')!;

        const setDumpWaterHeigh = (state: boolean, sensorName: string) => {
            const levelSensorElement = document.querySelector(`#${sensorName} circle`);
            if (!levelSensorElement) {
                return;
            }

            if (state) {
                levelSensorElement.setAttribute('fill', '#808080');
                const targetY = levelSensorElement.getAttribute('cy')!;
                dumpWaterElement.setAttribute('y', targetY);
                dumpWaterElement.setAttribute('height', (parseFloat(dumpBottomY) - parseFloat(targetY)).toString());
            }
            else {
                levelSensorElement.setAttribute('fill', '#f1f2f2');
            }
        }
        const map = Object.entries({
            lowLevel: 'low-level-sensor',
            midLevel: 'middle-level-sensor',
            hiLevel: 'high-level-sensor',
            emergencyLevel: 'emergency-level-sensor'
        });

        map.forEach(([k, v]) => {
            setDumpWaterHeigh(pumpingStationObjectState[k] as boolean, v);
        });

        const everyLevelSensorOff = map.every(([k]) => !(pumpingStationObjectState[k] as boolean));
        if (everyLevelSensorOff) {
            dumpWaterElement.setAttribute('height', '0');
        }
    }, [pumpingStationObjectState]);

    const faultPumpHandler = useCallback( ()=> {
        const svgNs = 'http://www.w3.org/2000/svg';
        if (!pumpingStationObjectState) {
            return;
        }

        [1, 2].forEach(a => {
            if (!pumpingStationObjectState[`faultPump${a}`]) {
                return;
            }

            const stopIcon = document.querySelector(`#pump${a}-stop-icon`);
            if (!stopIcon) {
                return;
            }

            stopIcon.setAttribute('width', '35');
            const num = stopIcon.querySelector(`#pump${a}-stop-icon-num`);
            if (num) {
                num.remove();
            }

            const textElement = document.createElementNS(svgNs, 'text');
            textElement.setAttribute('id', `pump${a}-stop-icon-num`);
            textElement.setAttribute('transform', 'translate(22 7)');
            textElement.setAttribute('font-size', '8');

            const tspan = document.createElementNS(svgNs, 'tspan');
            tspan.setAttribute('x', '0');
            tspan.setAttribute('y', '0');
            tspan.textContent = `${a}`;

            textElement.appendChild(tspan);
            stopIcon.appendChild(textElement);
        });

    }, [pumpingStationObjectState]);

    useEffect(() => {
        levelSensorsHandler();
        startStopPumpsHandler();
        faultPumpHandler();
    }, [faultPumpHandler, levelSensorsHandler, startStopPumpsHandler]);

    return (
        pumpingStationObjectState ?
            <>
                <div style={ { position: 'absolute', top: '20px', left: '85px' } }>
                    {!pumpingStationObjectState.startStop ? <StopIcon2 size={ 26 } color='#804040' /> : null}
                    {pumpingStationObjectState.emergencyLevel ? <EmergencyLevel size={ 28 } color='#804040' /> : null}
                    {pumpingStationObjectState.faultPump1 ?
                        <PumpingStationIcon id='pump1-stop-icon' size={ 30 } color='#804040' />
                        : null}
                    {pumpingStationObjectState.faultPump2 ?
                        <PumpingStationIcon id='pump2-stop-icon' size={ 30 } color='#804040' />
                        : null}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 379 638.04" height={ isXSmall ? 500 : 600 }>
                    <defs>
                        <pattern id="d" data-name="10 lpi 10%" x="0" y="0" width="72" height="72" patternTransform="translate(3206.15 -7921.49) rotate(-45)" patternUnits="userSpaceOnUse" viewBox="0 0 72 72">
                            <g>
                                <rect width="72" height="72" fill="none" />
                                <g>
                                    <line x1="71.75" y1="68.4" x2="144.25" y2="68.4" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="54" x2="144.25" y2="54" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="39.6" x2="144.25" y2="39.6" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="25.2" x2="144.25" y2="25.2" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="10.8" x2="144.25" y2="10.8" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="61.2" x2="144.25" y2="61.2" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="46.8" x2="144.25" y2="46.8" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="32.4" x2="144.25" y2="32.4" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="18" x2="144.25" y2="18" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="71.75" y1="3.6" x2="144.25" y2="3.6" stroke="#231f20" strokeWidth=".72" />
                                </g>
                                <g>
                                    <line x1="-.25" y1="68.4" x2="72.25" y2="68.4" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="54" x2="72.25" y2="54" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="39.6" x2="72.25" y2="39.6" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="25.2" x2="72.25" y2="25.2" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="10.8" x2="72.25" y2="10.8" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="61.2" x2="72.25" y2="61.2" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="46.8" x2="72.25" y2="46.8" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="32.4" x2="72.25" y2="32.4" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="18" x2="72.25" y2="18" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-.25" y1="3.6" x2="72.25" y2="3.6" stroke="#231f20" strokeWidth=".72" />
                                </g>
                                <g>
                                    <line x1="-72.25" y1="68.4" x2=".25" y2="68.4" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="54" x2=".25" y2="54" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="39.6" x2=".25" y2="39.6" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="25.2" x2=".25" y2="25.2" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="10.8" x2=".25" y2="10.8" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="61.2" x2=".25" y2="61.2" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="46.8" x2=".25" y2="46.8" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="32.4" x2=".25" y2="32.4" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="18" x2=".25" y2="18" stroke="#231f20" strokeWidth=".72" />
                                    <line x1="-72.25" y1="3.6" x2=".25" y2="3.6" stroke="#231f20" strokeWidth=".72" />
                                </g>
                            </g>
                        </pattern>
                        <pattern id="e" data-name="10 lpi 10%" patternTransform="translate(3179.01 -7944.82) rotate(-45)" xlinkHref="#d" />
                        <pattern id="f" data-name="10 lpi 10%" patternTransform="translate(-7791.26 3203.45) rotate(45)" xlinkHref="#d" />
                        <pattern id="g" data-name="10 lpi 10%" patternTransform="translate(-7817.48 3175.69) rotate(45)" xlinkHref="#d" />
                        <pattern id="h" data-name="10 lpi 10%" patternTransform="translate(-7803.23 3183.46) rotate(45)" xlinkHref="#d" />

                    </defs>
                    <rect x="80" y="7.04" width="218.65" height="594.5" fill="#d1d3d4" filter="url(#b)" />
                    <rect x="44.5" y="26.54" width="35" height="576" fill="url(#d)" stroke="#231f20" strokeMiterlimit="10" />
                    <rect x="299.5" y="26.54" width="35" height="576" fill="url(#e)" stroke="#231f20" strokeMiterlimit="10" />

                    <rect id="dump-bottom" x="44.5" height="35" stroke="#231f20" strokeMiterlimit="10" y="602.54" fill="url(#g)" width="290" />

                    <rect x="299.5" y="7.54" width="79" height="19" fill="url(#g)" stroke="#231f20" strokeMiterlimit="10" />
                    <rect x=".5" y="7.54" width="79" height="19" fill="url(#h)" stroke="#231f20" strokeMiterlimit="10" />
                    <rect id="dump-water" x="80.25" y="555.04" width="218.65" height="46.01" fill="#808080" filter="url(#i)" />

                    <g id="pump-1" >
                        <path d="m159.5,602.54h-73c6.33-6.67,12.67-13.33,19-20h36c6,6.67,12,13.33,18,20Z" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                        <rect x="104.5" y="529.54" width="19" height="47.5" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                        <circle cx="124" cy="573.04" r="20.5" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                        <g id="pump-1-blades" >
                            <line x1="124" y1="573.54" x2="144" y2="573.54" stroke="#939598" strokeWidth="1.25" />
                            <line x1="123.5" y1="552.54" x2="123.5" y2="573.54" stroke="#939598" strokeWidth="1.25" />
                            <line x1="123.25" y1="574.29" x2="137.75" y2="559.79" stroke="#939598" strokeWidth="1.25" />
                            <line x1="123.5" y1="572.04" x2="123.5" y2="593.04" stroke="#939598" strokeWidth="1.25" />
                            <line x1="103" y1="573.54" x2="123" y2="573.54" stroke="#939598" strokeWidth="1.25" />
                            <line x1="109.39" y1="588.2" x2="123.9" y2="573.7" stroke="#939598" strokeWidth="1.25" />
                            <line x1="123.39" y1="572.7" x2="108.3" y2="558.79" stroke="#939598" strokeWidth="1.25" />
                            <line x1="138.39" y1="586.7" x2="123.3" y2="572.79" stroke="#939598" strokeWidth="1.25" />
                            <circle cx="123.69" cy="573" r="4.54" fill="#939598" />
                            <animateTransform
                                id="pump-1-blades-animation"
                                attributeName="transform"
                                attributeType="XML"
                                type="rotate"
                                from="0 123.69 573"
                                to="360 123.69 573"
                                dur="4s"
                                repeatCount="indefinite"
                                begin="indefinite" />
                        </g>
                        <rect x="99.5" y="524.54" width="28" height="6" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                    </g>
                    <g id="pump-2">
                        <path d="m249.09,602.6h-73c6.33-6.67,12.67-13.33,19-20h36c6,6.67,12,13.33,18,20Z" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                        <rect x="194.09" y="529.6" width="19" height="47.5" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                        <circle cx="213.59" cy="573.1" r="20.5" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                        <g id="pump-2-blades">
                            <line x1="213.59" y1="573.6" x2="233.59" y2="573.6" stroke="#939598" strokeWidth="1.25" />
                            <line x1="213.09" y1="552.6" x2="213.09" y2="573.6" stroke="#939598" strokeWidth="1.25" />
                            <line x1="212.84" y1="574.36" x2="227.35" y2="559.85" stroke="#939598" strokeWidth="1.25" />
                            <line x1="213.09" y1="572.1" x2="213.09" y2="593.1" stroke="#939598" strokeWidth="1.25" />
                            <line x1="192.59" y1="573.6" x2="212.59" y2="573.6" stroke="#939598" strokeWidth="1.25" />
                            <line x1="198.98" y1="588.27" x2="213.49" y2="573.76" stroke="#939598" strokeWidth="1.25" />
                            <line x1="212.98" y1="572.76" x2="197.89" y2="558.85" stroke="#939598" strokeWidth="1.25" />
                            <line x1="227.98" y1="586.76" x2="212.89" y2="572.85" stroke="#939598" strokeWidth="1.25" />
                            <circle cx="213.28" cy="573.06" r="4.54" fill="#939598" />
                            <animateTransform
                                id="pump-2-blades-animation"
                                attributeName="transform"
                                attributeType="XML"
                                type="rotate"
                                from="0 213.28 573.06"
                                to="360 213.28 573.06"
                                dur="4s"
                                repeatCount="indefinite" begin="indefinite" />
                        </g>
                        <rect x="189.09" y="524.6" width="28" height="6" fill="#58595b" stroke="#231f20" strokeMiterlimit="10" />
                    </g>

                    <g id="low-level-sensor">
                        <g>
                            <rect x="289.5" y="530.54" width="71" height="10" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                            <circle cx="269" cy="543.04" r="12.5" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                        </g>
                        <line x1="280.5" y1="537.54" x2="289.5" y2="535.54" stroke="#231f20" strokeMiterlimit="10" />
                    </g>

                    <g id="middle-level-sensor">
                        <g>
                            <rect x="289.5" y="386.54" width="71" height="10" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                            <circle cx="269" cy="399.04" r="12.5" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                        </g>
                        <line x1="280.5" y1="393.54" x2="289.5" y2="391.54" stroke="#231f20" strokeMiterlimit="10" />
                    </g>

                    <g id="high-level-sensor">
                        <g>
                            <rect x="289.5" y="242.54" width="71" height="10" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                            <circle cx="269" cy="255.04" r="12.5" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                        </g>
                        <line x1="280.5" y1="249.54" x2="289.5" y2="247.54" stroke="#231f20" strokeMiterlimit="10" />
                    </g>

                    <g id="emergency-level-sensor">
                        <g>
                            <rect x="289.5" y="98.54" width="71" height="10" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                            <circle cx="269" cy="111.04" r="12.5" fill="#f1f2f2" stroke="#231f20" strokeMiterlimit="10" />
                        </g>
                        <line x1="280.5" y1="105.54" x2="289.5" y2="103.54" stroke="#231f20" strokeMiterlimit="10" />
                    </g>

                    <text transform="translate(99.9 517.39)" fill="#231f20" fontFamily="MyriadPro-Regular, 'Myriad Pro'" fontSize="14"><tspan x="0" y="0">Насос 1</tspan></text>
                    <text transform="translate(188.15 516.76)" fill="#231f20" fontFamily="MyriadPro-Regular, 'Myriad Pro'" fontSize="14"><tspan x="0" y="0">Насос 2</tspan></text>
                </svg>
            </>
            : <div className='dx-nodata'><div>{formatMessage('noDataText')}</div></div>
    );
}