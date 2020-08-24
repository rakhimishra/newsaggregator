import React, {  Component,useState } from 'react';
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, ListGroup,ListGroupItem,CardDeck,Dropdown,DropdownButton} from 'react-bootstrap'
import {Nav, Navbar,Form,FormControl,Button} from 'react-bootstrap'
import NavigationBar from './components/Cards'
import Cards from './components/Cards'
import './App.scss';

import { WeatherData } from './components/WeatherData'
import { StatusData } from './components/StatusData'
const API_KEY ="c7fcb4212b3dd249688a043361e8c60f "
class App extends Component {

  constructor(){
    super();
    this.state = {
    search:"",
    error: "",
    posts: [],

    //for weather 
    status: 'init',
    isLoaded: false,
    weatherData: null
    };

  }
  
  handleChange1 = (event) => {
    this.setState({
      search:event.target.value
    })
  }
  OnSearchChange = (event) => {
    this.setState({
      search:event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const Search = this.state.search
    const top_news = "https://gnews.io/api/v3/top-news?token=1e8cdb0986d7a3f4f20ded0f4bcdecd3"
    const URL = `https://gnews.io/api/v3/search?q=${Search}&token=1e8cdb0986d7a3f4f20ded0f4bcdecd3`;
    axios
      .get(URL)
      .then((response) => {
        console.log(response.data.articles);
        this.setState({ posts: response.data.articles });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Rendering error retrieving data" });
      });
  }
  onSearch = (event) => {
    event.preventDefault();
    const Search = this.state.searc
    const URL = `https://gnews.io/api/v3/topics/${Search}?token=1e8cdb0986d7a3f4f20ded0f4bcdecd3`;
    axios
      .get(URL)
      .then((response) => {
        console.log(response.data.articles);
        this.setState({ posts: response.data.articles });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Rendering error retrieving data" });
      });
  }

  componentDidMount() {
    const URL = `https://gnews.io/api/v3/search?q=mumbai&token=c00788edd534553dcf760e657940b6f4

    `;
    axios
      .get(URL)
      .then((response) => {
        console.log(response.data.articles);
        this.setState({ posts: response.data.articles });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Rendering error retrieving data" });
      });

      if(localStorage.getItem('location-allowed')) {
        this.weatherInit();
      } else {
        return;
      }
  }



  abortController = new AbortController();
  controllerSignal = this.abortController.signal;

  weatherInit = () => {

    const success = (position) => {
      this.setState({status: 'fetching'});
      localStorage.setItem('location-allowed', true);
      this.getWeatherData(position.coords.latitude, position.coords.longitude);
    }
    
    const error = () => {
      this.setState({status: 'unable'});
      localStorage.removeItem('location-allowed');
      alert('Unable to retrieve location.');
    }
    
    if (navigator.geolocation) {
      this.setState({status: 'fetching'});
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      this.setState({status: 'unsupported'});
      alert('Your browser does not support location tracking, or permission is denied.');
    }
  }

  getWeatherData = (lat, lon) => {
    const weatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c7fcb4212b3dd249688a043361e8c60f
    `;

    fetch(weatherApi, { signal: this.controllerSignal })
    .then(response => response.json())
    .then(
      (result) => {
        console.log(result);
        const { name } = result;
        const { country } = result.sys;
        const { temp, temp_min, temp_max, feels_like, humidity } = result.main;
        const { description, icon } = result.weather[0];
        const { speed, deg } = result.wind;

        this.setState({
          status: 'success',
          isLoaded: true,
          weatherData: {
            name,
            country,
            description,
            icon,
            temp: temp.toFixed(1),
            feels_like: feels_like.toFixed(1),
            temp_min: temp_min.toFixed(1),
            temp_max: temp_max.toFixed(1),
            speed,
            deg,
            humidity
          }
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }
  
  onClick = () => {
    this.weatherInit();
  }

  returnActiveView = (status) => {
    switch(status) {
      case 'init':
        return(
          <button 
          className='btn-main' 
          onClick={this.onClick}
          >
            Get My Location
          </button>
        );
      case 'success':
        return <WeatherData data={this.state.weatherData} />;
      default:
        return <StatusData status={status} />;
    }
  }


  // componentDidMount() {
  //   if(localStorage.getItem('location-allowed')) {
  //     this.weatherInit();
  //   } else {
  //     return;
  //   }
  // }

  componentWillUnmount() {
    this.abortController.abort();
  }


  render() {
    const { posts, error } = this.state;
    
    
    return (
      <>
        <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand href="#home">News Aggregator App</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
      
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder=" Search any news" className="mr-sm-2" onChange={this.handleChange1} />
              <Button variant="outline-info" onClick={this.handleSubmit}>Search</Button>
          </Form>
          <DropdownButton id="dropdown-item-button" title="Filter your search.." style={{paddingLeft: 10}} onClick={this.onSearch} onChange={this.onSearchChange}>
            <Dropdown.ItemText>Interests</Dropdown.ItemText>
            <Dropdown.Item as="button" >World</Dropdown.Item>
            <Dropdown.Item as="button">Science</Dropdown.Item>
            <Dropdown.Item as="button">Entertainment</Dropdown.Item>
            <Dropdown.Item as="button">Nation</Dropdown.Item>
            <Dropdown.Item as="button">Business</Dropdown.Item>
            <Dropdown.Item as="button">Technology</Dropdown.Item>
            <Dropdown.Item as="button">Sports</Dropdown.Item>
            <Dropdown.Item as="button">Health</Dropdown.Item>
          </DropdownButton>
        </Navbar>
        <div className='App'>
        <div className='container'>
          {this.returnActiveView(this.state.status)}
        </div>
      </div>
       <CardDeck style={{margin: "100px", display:"grid" ,gridTemplateColumns:"repeat(3,auto)",justifyContent:"Space-between"}}>
       
       {posts.map(post=>(
           
           <Card style={{borderRadius:"10px", marginTop:"30px", boxShadow: "10px 10px 8px #888888"}}>
           <Card.Img variant="top" src={post.image} />
           <Card.Body>
             <Card.Title>{post.title}</Card.Title>
             <Card.Text>
              {post.description}
             </Card.Text>
           </Card.Body>
           <Card.Footer>
            <div><Button variant="primary">Read More</Button></div>
            <small className="text-muted">Last updated at {post.publishedAt}</small>
           </Card.Footer>
         </Card>
         ))}
        </CardDeck>
      
       
    </>
    );
  }
}

export default App;