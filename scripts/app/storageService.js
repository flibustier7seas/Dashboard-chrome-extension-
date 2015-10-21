define([], function () {			  
    return {
		getSettings: function(callback){
			// The chrome.storage API is asynchronous.
			chrome.storage.sync.get({
					login: "",
					tfsUrl:"",
					jiraUrl:"",
					teamCityUrl:"",
					defaultFilter:0
				},
				function(items) {
					callback(items);
				}
			);			  
		},
		
		setFilterIndex: function(index){
			chrome.storage.sync.set({
				defaultFilter: index
				}, function() {});
		}
	}
});
