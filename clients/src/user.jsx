/** @jsx React.DOM */
'use strict';

var React = require('react');

window.React = React;

var Map = require('./Map.jsx');

React.renderComponent(
  <Map />,
  document.getElementById('content')
);
