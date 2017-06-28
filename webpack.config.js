// webpack.config.js

var path    = require ('path');
var webpack = require ('webpack');


module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      'react-hot-loader/patch',
      './components/index.jsx'

    ]
  },
  output: {
    path: path.resolve(__dirname, 'client/dist'),
    filename: 'bundle.min.js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, 
        exclude: /node_modules/, 
        loader: "babel-loader",
        query: {
          presets: ['es2015', 'react']
        } 
      },
      {
        test:   /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: [
        {
          loader: 'file-loader',
          options: {
            query: {
              name:'components/img/[name].[ext]'
            }
          }
        },
        {
          loader: 'image-webpack-loader',
          options: {
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: true,
              },
              optipng: {
                optimizationLevel: 7,
              }
            }
          }
        }
      ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    //new webpack.optimize.UglifyJsPlugin({
    //  compress: {
    //    warnings: false
    //  },
    //  sourceMap: true,
    //  comments: function(node, comment) {
    //    // Remove other Okta copyrights
    //    var isLicense = /^!/.test(comment.value);
    //    var isOkta = /.*Okta.*/.test(comment.value);
    //    return isLicense && !isOkta;
    //  }
    //}),

  ]
};