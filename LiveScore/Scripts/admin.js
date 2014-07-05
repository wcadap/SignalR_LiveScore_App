(function () {
    "use strict";

    var scoreHub;

    var liveScore = {"TeamName1": "", "Team1Score": 0, "TeamName2": "", "Team2Score": 0};

    var TeamNameSet1;
    var TeamNameSet2;

    var $alertMsg;
    var alertHtmlClose = '<a href="#" data-dismiss="alert" class="close">&times;</a>';
    var alertHtml;

    var $Team1Name = $("#TeamNameSet1");
    var $Team2Name = $("#TeamNameSet2");

    //For Admin
    var $Team1NameScoreBoard = $("#Team1NameScoreBoard");
    var $Team2NameScoreBoard = $("#Team2NameScoreBoard");

    var $Team1ScoreBoardScore = $("#Team1ScoreBoardScore");
    var $Team2ScoreBoardScore = $("#Team2ScoreBoardScore");


    $(function () {
        $.ajaxSetup({
            cache: false
        });

        scoreHub = $.connection.scoreHub;

        configListeners();

        // Start Hub
        $.connection.hub.start({ transport: ['webSockets', 'serverSentEvents', 'longPolling'] })
            .done(function () {
                scoreHub.server.connect();
            });
    });

    function configListeners() {
        scoreHub.client.getScore = function (_liveScore) {
            $alertMsg.hide();
           
            //Avoid empty data when switching pages
            
            if (_liveScore.TeamName1 != null) {
                //For the config

                $Team1Name.val(_liveScore.TeamName1);
                $Team2Name.val(_liveScore.TeamName2);

                //For the Scoreboard

                $Team1NameScoreBoard.html(_liveScore.TeamName1);
                $Team2NameScoreBoard.html(_liveScore.TeamName2);

                $Team1ScoreBoardScore.val(_liveScore.Team1Score);
                $Team2ScoreBoardScore.val(_liveScore.Team2Score);

                liveScore = _liveScore;

            }
        };

        $("#SendScore").click(function () {
            sendScore();
        });

        $("#ConfigBoard").click(function () {
            conFigBoard();
        });

        $alertMsg = $("#alertMsg");
        $alertMsg.hide();
        $alertMsg.on("close.bs.alert", function () {
            $alertMsg.hide();
            return false;
        });

    }

    function conFigBoard() {
        TeamNameSet1 = $Team1Name.val();
        TeamNameSet2 = $Team2Name.val();

        if ((TeamNameSet1 == "") || (TeamNameSet2 == "")) {
            alertHtml = alertHtmlClose;
            alertHtml = alertHtml.concat('Team Names are empty. Please supply.');

            $alertMsg.show();
            $alertMsg.html(alertHtml);
            return false;
        }
        $alertMsg.hide();

        $Team1NameScoreBoard.html(TeamNameSet1);
        $Team2NameScoreBoard.html(TeamNameSet2);

        liveScore.TeamName1 = TeamNameSet1;
        liveScore.Team1Score = 0;
        liveScore.TeamName2 = TeamNameSet2;
        liveScore.Team2Score = 0;

        scoreHub.server.gameConfigure(liveScore);
        $('#LiveTabs a[href="#scoreBoardTab"]').tab('show');
    }

    function sendScore() {
        
        var isDefinedTeam1 = $Team2NameScoreBoard.html().toLowerCase().indexOf("not set");
        var isDefinedTeam2 = $Team2NameScoreBoard.html().toLowerCase().indexOf("not set");

        if ((isDefinedTeam1 >= 0) || (isDefinedTeam2 >= 0)) {
            alertHtml = alertHtmlClose;
            alertHtml = alertHtml.concat('Cannot send score. No teams has been defined.');
            $alertMsg.show();
            $alertMsg.html(alertHtml);
            return false;
        }

        $alertMsg.hide();
        var Team1Score = $Team1ScoreBoardScore.val();
        var Team2Score = $Team2ScoreBoardScore.val();

        liveScore.Team1Score = Team1Score;
        liveScore.Team2Score = Team2Score;

        scoreHub.server.updateScore(liveScore);
    }

})();
