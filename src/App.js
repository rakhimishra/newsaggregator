import React, { Component, useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Card,
  ListGroup,
  ListGroupItem,
  CardDeck,
  Dropdown,
  DropdownButton,
  NavDropdown,
} from "react-bootstrap";
import { Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";
import NavigationBar from "./components/Cards";
import Cards from "./components/Cards";
import "./App.scss";
import "./index.css";
import { WeatherData } from "./components/WeatherData";
import { StatusData } from "./components/StatusData";
class App extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      error: "",
      posts: [],

      //for weather
      status: "init",
      isLoaded: false,
      weatherData: null,
    };
  }

  handleChange1 = (event) => {
    this.setState({
      search: event.target.value,
    });
  };

  //Function when users seaches the news in the search field and clicking search button

  handleSubmit = (event) => {
    event.preventDefault();
    const Search = this.state.search;
    const top_news =
      "https://gnews.io/api/v3/top-news?token=1e8cdb0986d7a3f4f20ded0f4bcdecd3";
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
  };

  
  //Function when component is mounting and showing the static data of mumbai region news
  componentDidMount() {
    const URL = `https://gnews.io/api/v3/search?q=mumbai&token=b7cd3031c5aaed1a3eb876eb3ea3530f `;
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

    if (localStorage.getItem("location-allowed")) {
      this.weatherInit();
    } else {
      return;
    }
  }

  abortController = new AbortController();
  controllerSignal = this.abortController.signal;
  
  //Funtion to actually initialising to get the users geolocation
  weatherInit = () => {
    const success = (position) => {
      this.setState({ status: "fetching" });
      localStorage.setItem("location-allowed", true);
      this.getWeatherData(position.coords.latitude, position.coords.longitude);
    };

    const error = () => {
      this.setState({ status: "unable" });
      localStorage.removeItem("location-allowed");
      alert("Unable to retrieve location.");
    };

    if (navigator.geolocation) {
      this.setState({ status: "fetching" });
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      this.setState({ status: "unsupported" });
      alert(
        "Your browser does not support location tracking, or permission is denied."
      );
    }
  };
  //Function to get the weather data by fetching the Weatherapi with key and latitude longitude of the users location
  getWeatherData = (lat, lon) => {
    const API_KEY = process.env;
    const weatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c7fcb4212b3dd249688a043361e8c60f
    `;

    fetch(weatherApi, { signal: this.controllerSignal })
      .then((response) => response.json())
      .then(
        (result) => {
          console.log(result);
          const { name } = result;
          const { country } = result.sys;
          const {
            temp,
            temp_min,
            temp_max,
            feels_like,
            humidity,
          } = result.main;
          const { description, icon } = result.weather[0];
          const { speed, deg } = result.wind;

          this.setState({
            status: "success",
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
              humidity,
            },
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  };

  onClick = () => {
    this.weatherInit();
  };

  returnActiveView = (status) => {
    switch (status) {
      case "init":
        return (
          <button className="btn-main" onClick={this.onClick}>
            Get My Location
          </button>
        );
      case "success":
        return <WeatherData data={this.state.weatherData} />;
      default:
        return <StatusData status={status} />;
    }
  };
  componentWillUnmount() {
    this.abortController.abort();
  }
  render() {
    const { posts, error } = this.state;
    return (
      <>
      {/* Navigation bar of the app */}

        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">News Aggregator App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                onChange={this.handleChange1}
              />
              <Button variant="outline-primary" onClick={this.handleSubmit}>
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>

        <div className="App">
          <div className="container">
            {this.returnActiveView(this.state.status)}
          </div>
        </div>
        <CardDeck
          className="CardDeck"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Mapping all the data came from the Gnews api call and showing the cards  */}
          {posts.map((post) => (
            <div
              className="Outer-Card"
              style={{
                width: "400px",
                height: "600px",
                borderRadius: "10px",
                margin: "30px",
                boxShadow: "5px 5px 6px 3px rgb(204,204,204)",
                position: "relative",
              }}
            >
              <Card style={{ border: "none" }}>
                <img
                  variant="top"
                  src={post.image}
                  style={{ margin: "15px", height: "200px", weight: "100px" }}
                />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Card.Text>Souce : {post.source.name} </Card.Text>
                </Card.Body>
              </Card>
              <div style={{ position: "absolute", bottom: 0, margin: "20px" }}>
                <div>
                  <Button variant="primary" href={post.url}>Read More</Button>
                </div>
                <small className="text-muted">
                  Last updated at {post.publishedAt}
                </small>
              </div>
            </div>
          ))}
        </CardDeck>
      </>
    );
  }
}

export default App;
