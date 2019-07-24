import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';

class App extends React.Component {

  state = {
    weather: null,
    loading: false,
    text: '',
    error: null
  }

  getWeather = async (e) => {
    // this line prevents the page from reloading (which is the default for <form> elements)
    e.preventDefault()
    // set "loading" to true in the state so we can show a spinner
    this.setState({ loading: true, weather: null })
    // here is our giphy api key
    var key = 'e395404aff8013c5bb4563d554340006'
    // this line make a URL string, I got this from their documentation
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.text}&units=imperial&APPID=${key}`
    // "fetch" calls the giphy API!
    var r = await fetch(url)
    // this lines extracts JSON (javascript object notation)
    var json = await r.json()
    // set the weathers in state, and loading to false, and the text to blank again
    if (r.status === 200) {
      this.setState({ weather: json.list, loading: false, text: '', error: null })
    } else {
      this.setState({ error: json.message, loading: false })
    }

    console.log(json)
  }

  render() {
    // extract the pieces of state so we can use them easily in our HTML code
    var { weather, loading, text, error } = this.state

    var data
    if (weather) {
      data = {
        labels: weather.map(w => moment(w.dt * 1000).format('MMMM Do YYYY, h:mm a')),
        datasets: [{
          label: 'temperature',
          borderWidth: 1,
          data: weather.map(w => w.main.temp),
          backgroundColor: 'rgba(132,99,255,0.2)',
          borderColor: 'rgba(132,99,255,1)',
          hoverBackgroundColor: 'rgba(132,99,255,0.4)',
          hoverBorderColor: 'rgba(132,99,255,1)',
        }]
      }
    }
    console.log(data)
    return (
      <div className="App">
        <form className="App-header" onSubmit={this.getWeather}>
          <TextField value={text}
            autoFocus
            variant="outlined"
            label="Search for weather"
            onChange={e => this.setState({ text: e.target.value })}
            style={{ width: '100%', marginLeft: 8 }}
          />
          <Button variant="contained"
            color="primary"
            disabled={loading || !text}
            type="submit"
            style={{ width: 150, margin: '0 10px', height: 75 }}>
            <SearchIcon style={{ marginRight: 8 }} />
            Search
          </Button>
        </form>
        {loading && <LinearProgress />}
        <main>
          {data && <Bar
            data={data}
            width={100}
            height={50}
          //options={{ maintainAspectRatio: true }}
          />}
          {error & <div>
            {error}
          </div>}
        </main>
      </div>
    );
  }
}

// the weather component is very simple
// it just returns a <div> with an <img> inside it
// the "src" of the <img> is the URL that is given to us by the giphy API
// function weather(props) {
//   const { weather } = props
//   const url = weather.images.fixed_height.url
//   return (<div className="weather-wrap" onClick={() => window.open(url, '_blank')}>
//     <img height="200" alt="weather" src={url} />
//   </div>)
// }

export default App;
