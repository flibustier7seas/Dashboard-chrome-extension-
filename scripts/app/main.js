define(["jquery", "ko", "./viewModels/appViewModel", "./viewModels/pullRequestsViewModel", "./viewModels/statisticsViewModel",
    "./server/jiraсmds", "./server/teamСityсmds", "./server/tfsсmds", "./viewLoader", "moment", "./factory","./storageService"],
    function ($, ko, appViewModel, pullRequestsViewModel, statisticsViewModel, jiracmds, teamСityсmds, tfscmds, viewLoader, moment, factory,storageService) {
        $(function () {
            moment.locale(window.navigator.language);
			
			var setFilterIndex = storageService.setFilterIndex;
			
			storageService.getSettings(function(settings){
			
				var app = new appViewModel(settings.login);

				var jira = new jiracmds(settings.jiraUrl);
				var tc = new teamСityсmds(settings.teamCityUrl);
				var tfs = new tfscmds(settings.tfsUrl);

				var loader = new factory(tfs, tc, jira);

				var pullRequestsItem = {
					data: null,
					viewName: "pullRequestsView",
					title: "Pull requests",
					isLoaded: ko.observable(false),
					active: ko.observable(true)
				};

				tfs.getRepositories().then(function (data) {

					pullRequestsItem.data = new pullRequestsViewModel(data, settings.login, loader, setFilterIndex, settings.defaultFilter);

					viewLoader.loadView("pullRequestsView", function () {

						pullRequestsItem.isLoaded(true);
						app.addItem(pullRequestsItem, "Pull Requests");
					});
				});

				ko.applyBindings(app);
			
			}); 
        });
    });

//var statisticsItem = {
//    data: new statisticsViewModel(pullRequests),
//    viewName: "statisticsView",
//    title: "Statistics",
//    isLoaded: ko.observable(false),
//    active: ko.observable(false)
//};

//viewLoader.loadView("statisticsView", function () {
//    statisticsItem.isLoaded(true);
//    //pullRequestsItem.data.statisticsViewModel(statisticsItem);
//    app.addItem(statisticsItem, "Statistics");
//});