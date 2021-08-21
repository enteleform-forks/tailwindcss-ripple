const _ = require('lodash');
const Color = require('color');

module.exports = function() {
    return ({ theme, e, addComponents, postcss }) => {
        const defaultBgColors = {};
        const rippleBgColors = theme('ripple.colors', defaultBgColors);
        const defaultDarkenValue = 0.2;
        let darkenValue = theme('ripple.darken', defaultDarkenValue);
        if (isNaN(darkenValue) || darkenValue > 1 || darkenValue < 0) {
            darkenValue = defaultDarkenValue;
        }
        const defaultModifierTransition = 'background 0.8s';
        let modifierTransition = theme('ripple.modifierTransition', defaultModifierTransition);
        const defaultActiveTransition = 'background 0s';
        let activeTransition = theme('ripple.activeTransition', defaultActiveTransition);

        function returnColorPair([modifier, value]) {
            return [
                `${modifier}`,
                {
                    transition: "background 0.5s",
                    '&:hover': {
											transition: "background 0.7s",
                    },
                    '&:active': {
                        backgroundColor: value,
                        transition:      "background 0.1s",
                    },
                },
            ];
        }
        //function returnColorPair([modifier, value]) {
        //    return [
        //        `${modifier}`,
        //        {
        //            backgroundColor: value,
        //            backgroundPosition: 'center',
        //            transition: modifierTransition,
        //            '&:hover': {
				//							background: `${value} radial-gradient(circle, transparent 1%, ${value} 1%) center/15000%`,
        //            },
        //            '&:active': {
        //                backgroundColor: value,
        //                backgroundSize: '100%',
        //                transition: activeTransition,
        //            },
        //        },
        //    ];
        //}

        const allTheColors = _(rippleBgColors)
            .flatMap((value, modifier) => {
                if (typeof value == 'object') {
                    return _.map(value, (v, m) => {
                        return [`.${e(`ripple-${modifier}-${m}`)}`, v];
                    });
                }
                if (
                    typeof value == 'string' &&
                    value.length > 1
                ) {
                    try {
                        value
                    } catch (err) {
                        return [];
                    }
                    return [[`.${e(`ripple-${modifier}`)}`, value]];
                }
            })
            .value();

        const components = _.fromPairs(
            _.map(allTheColors, (color, index) => {
                return returnColorPair(color);
            })
        );

        addComponents(components);
    };
};
