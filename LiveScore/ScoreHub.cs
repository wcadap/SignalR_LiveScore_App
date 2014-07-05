using Microsoft.AspNet.SignalR;
using LiveScore.Model;

namespace LiveScore
{
    public class ScoreHub : Hub
    {
        
        static Score _score = new Score();

        public void Connect()
        {
            Clients.Caller.getScore(_score);
        }

        public void GameConfigure(Score Score)
        {
            _score.TeamName1 = Score.TeamName1;
            _score.TeamName2 = Score.TeamName2;
            _score.Team1Score = 0;
            _score.Team2Score = 0;
            SendScore();
        }

        public void UpdateScore(Score Score)
        {
            _score.TeamName1 = Score.TeamName1;
            _score.Team1Score = Score.Team1Score;
            _score.TeamName2 = Score.TeamName2;
            _score.Team2Score = Score.Team2Score;
            
            SendScore();
        }

        public void SendScore()
        {
            Clients.All.getScore(_score);
        }
    }
}

