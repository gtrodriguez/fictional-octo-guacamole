/**
 * @jest-environment node
 */
import Enzyme from 'enzyme';
import { MongoClient } from 'mongodb';
import Adapter from 'enzyme-adapter-react-15';
import App from '../../../../app';

async function initializePlayers() {
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STR);
  await client.connect();
  const db = client.db();
  await db.collection('users').insertMany([
    { _id: 'abc123', username: 'Player1', email: 'player1@email.com' },
    { _id: 'def456', username: 'Player2', email: 'player2@email.com' },
  ]);
  await client.close();
}

describe('Game Session Integration Test', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let server;

  beforeAll(() => {
    return App().then(startedServer => {
      server = startedServer;
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('renders correctly', () => {

  });
});
