var Colors = require('material-ui/styles/colors');
var ColorManipulator = require('material-ui/utils/color-manipulator');
var Spacing = require('material-ui/styles/spacing');
var ThemeManager = require('material-ui/styles/theme-manager');

var rawTheme = {
  spacing: Spacing,
  fontFamily: '"Microsoft Yahei", "宋体","Arial Narrow"',
  palette: {
    primary1Color: Colors.cyan700,
    primary2Color: Colors.cyan700,
    primary3Color: Colors.grey600,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.pinkA400,
    accent3Color: Colors.pinkA100,
    textColor: '#dde1e3',
    alternateTextColor: '#dde1e3',
    canvasColor: '#455a64',//transparent
    borderColor: ColorManipulator.fade(Colors.fullWhite, 0.9),
    disabledColor: ColorManipulator.fade(Colors.fullWhite, 0.3),
    pickerHeaderColor: ColorManipulator.fade(Colors.fullWhite, 0.12),
    clockCircleColor: ColorManipulator.fade(Colors.fullWhite, 0.12),
  },
};

var theme = ThemeManager.getMuiTheme(rawTheme);

//console.log(theme);

module.exports = theme;