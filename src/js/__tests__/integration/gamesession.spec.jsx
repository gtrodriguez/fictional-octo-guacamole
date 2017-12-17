import React from 'react';
import Enzyme from 'enzyme';
import { MongoClient } from 'mongodb';
import Adapter from 'enzyme-adapter-react-15';
import App from '../../../../app';

function initializePlayers(){
  // Use connect method to connect to the server
  MongoClient.connect(process.env.MONGODB_CONNECTION_STR, function(err, db) {
    console.log("Connected successfully to server");

    db.users.insert({_id:"abc123",username:"Player1",email:"player1@email.com"});
    db.users.insert({_id:"def456",username:"Player2",email:"player2@email.com"});

    db.close();
  });
}

describe('Game Session Integration Test', () =>{
  Enzyme.configure({ adapter: new Adapter() })
  let server;

  beforeAll(() => {
    return App().then(startedServer => {
      server = startedServer;
    })
  });

  afterAll((done) => {
    server.close(done);
  });

  it('renders correctly',() => {

  });
});
