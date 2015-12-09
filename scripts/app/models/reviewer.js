define([], function () {
    return function (displayName, id, vote,login) {
        this.displayName = displayName;
        this.id = id;
        this.vote = vote;
        this.login = login;
        this.titleVote = getTitleVote(vote);
		
		function getTitleVote(vote){
			switch (vote){
				case -10: return "Rejected";
				case -5: return "Waiting for the author";
				case 0: return "No vote";
				case 5: return "Approved with suggestions";
				case 10: return "Approved";
			}
            return "";
		}
    };
});