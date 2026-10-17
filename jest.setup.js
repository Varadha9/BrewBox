/* eslint-disable no-undef */
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const SafeAreaInsetsContext = React.createContext(inset);
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaView: ({ children }) => children,
    SafeAreaInsetsContext,
  };
});

jest.mock('react-native-screens', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    enableScreens: jest.fn(),
    screensEnabled: jest.fn(() => true),
    compatibilityFlags: {
      usesNewAndroidHeaderHeightImplementation: false,
    },
    Screen: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenContainer: ({ children, ...props }) => React.createElement(View, props, children),
    NativeScreen: ({ children, ...props }) => React.createElement(View, props, children),
    NativeScreenContainer: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStack: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStackItem: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStackHeaderConfig: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStackHeaderBackButtonImage: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStackHeaderRightView: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStackHeaderLeftView: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStackHeaderTitleView: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStackHeaderCenterView: ({ children, ...props }) => React.createElement(View, props, children),
    ScreenStackHeaderSearchBarView: ({ children, ...props }) => React.createElement(View, props, children),
  };
});
