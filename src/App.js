import React from 'react';
import './App.css';
// import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { Input } from 'antd';
import { Spin } from 'antd';
import { Alert } from 'antd';
const { Search } = Input;



class App extends React.Component {

  state = {
    weather: null,
    loading: false,
    text: '',
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
          <Search
            value={text}
            placeholder="Search here"
            enterButton="Search"
            size="large"
            onChange={e => this.setState({ text: e.target.value })}
          />
        </form>
        {loading && <Spin size='large' />}
        <main>
          {data && <Bar
            data={data}
            width={100}
            height={50}
          />}
          {error && <Alert message={error} type="error" showIcon />}
        </main>
      </div>
    );
  }
}

export default App;
