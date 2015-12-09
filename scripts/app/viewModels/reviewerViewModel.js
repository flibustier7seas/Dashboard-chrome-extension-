//Не используется
define(["jquery", "ko"], function ($, ko) {
    return function (reviewer) {
        var self = this;

        this.displayName = ko.observable(reviewer.displayName);
        this.vote = ko.observable(reviewer.vote);
        this.titleVote = ko.computed(function () {
			switch (self.vote()){
				case -10: return "Rejected";
				case -5: return "Waiting for the author";
				case 0: return "No vote";
				case 5: return "Approved with suggestions";
				case 10: return "Approved";
			}
            return "";
        });
    };
});
