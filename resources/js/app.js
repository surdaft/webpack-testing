const ReactDOM = require('react-dom');
const React = require('react'); // used when babel transpiles this file

const App = require('./components/App.jsx');
ReactDOM.render(<App />, document.getElementById('app-mount'));