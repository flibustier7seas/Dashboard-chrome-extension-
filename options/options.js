$(function() {
	chrome.storage.sync.get(
		{
			login: "",
			tfsUrl:"",
			jiraUrl:"",
			teamCityUrl:""
		}, 
		function(items) {
			$("#login").val(items.login);
			$("#tfs").val(items.tfsUrl);
			$("#jira").val(items.jiraUrl);
			$("#teamcity").val(items.teamCityUrl);
		}
	);

	$("#btnSave").click(function(){
		save_options()
	});	
});

function save_options() {
	chrome.storage.sync.set({
			login: $("#login").val(),
			tfsUrl: $("#tfs").val(),
			jiraUrl: $("#jira").val(),
			teamCityUrl: $("#teamcity").val()
		}, 
		function() {
			var status = document.getElementById('status');			
			status.textContent = 'Options saved.';
			setTimeout(function() {
			  status.textContent = '';
			}, 750);
		}
	);
};