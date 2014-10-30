module.exports = {
  entry: './clients/src/user.jsx',
  
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx' }
    ]
  }
};
