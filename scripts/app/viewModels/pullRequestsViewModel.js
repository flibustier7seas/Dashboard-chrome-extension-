define(["jquery", "ko", "i18n!nls/tr"], function ($, ko, tr) {
    return function (repositories, userLogin, loader, setFilterIndex, defaultFilter) {
        var self = this;
		
		this.setFilterIndex = setFilterIndex;
        
        this.statisticsViewModel = ko.observable();
		
		
        this.list = ko.observableArray();

        this.load = function () {
            repositories.forEach(function (repository) {
                loader.getPullRequests(repository).then(function (data) {
                    ko.utils.arrayPushAll(this.list, data);
                }.bind(this));
            }.bind(this));
        };
        this.load();

        this.headers = [
            { title: ""/*tr.header_Status*/, sortPropertyName: 'minVote', status: ko.observable(0), isFilter: false },
            { title: tr.header_Title, sortPropertyName: 'title', status: ko.observable(0),isFilter: true },
            { title: tr.header_Repository, sortPropertyName: 'repositoryName', status: ko.observable(0),isFilter: true },
            //{ title: tr.header_Author, sortPropertyName: 'createdByDisplayName',status: ko.observable(0),isFilter: true },
            { title: tr.header_CreationDate, sortPropertyName: 'creationDate', status: ko.observable(0),isFilter: false },
            { title: tr.header_Updated, sortPropertyName: 'update', status: ko.observable(0),isFilter: false },
            { title: tr.header_StatusIssue, sortPropertyName: 'statusName', status: ko.observable(0),isFilter: true },
            { title: ""/*tr.header_Priority*/, sortPropertyName: 'priorityName', status: ko.observable(0),isFilter: false },
            { title: ""/*tr.header_TypeIssue*/, sortPropertyName: 'issueTypeName', status: ko.observable(0),isFilter: false }
        ];

        this.title = {
            repository: tr.header_Repository,
            author: tr.header_Author,
            creationDate: tr.header_CreationDate,
            mergeStatus: tr.header_mergeStatus
        };

        ///NOTE: Сортировка
        this.sortHeader = this.headers[0];

        this.sort = function (data) {
            if (data.status() !== 0) {
                data.status(-data.status());
            } else {
                self.sortHeader.status(0);
                data.status(1);
                self.sortHeader = data;
            }
            self.sortList();
        };

        this.sortList = function () {
            var property = self.sortHeader.sortPropertyName;
            var compare = function (a, b) {
                if (self.sortHeader.status() == 1) {
                    return a[property]() < b[property]() ? -1 : a[property]() > b[property]() ? 1 : a[property]() == b[property]() ? 0 : 0;
                } else {
                    return a[property]() > b[property]() ? -1 : a[property]() < b[property]() ? 1 : a[property]() == b[property]() ? 0 : 0;
                }
            };
            self.list.sort(compare);
        };

        //NOTE: Фильтрация
        //NOTE: Фильтры по кнопке
        this.filters = [
            { title: tr.filter_ShowAll, isActive: ko.observable(false), filter: null },
            { title: tr.filter_StatusNoVote, isActive: ko.observable(false), filter: function (item) 
				{ 
					return item.titleMinVote() == 'No vote'; 
				} 
			},
            { title: tr.filter_StatusYes, isActive: ko.observable(false), filter: function (item) { return item.titleMinVote() == 'Yes'; } },
            { title: tr.filter_StatusNo, isActive: ko.observable(false), filter: function (item) { return item.titleMinVote() == 'No'; } },
            { title: tr.filter_MyPullRequest, isActive: ko.observable(false), filter: function (item) { 
					return item.createdByLogin().toLowerCase() == userLogin.toLowerCase(); 
				} 
			},
            {
                title: tr.filter_MyReview, isActive: ko.observable(false), filter: function (item) {
                    return item.reviewers().filter(function (reviewer) {
                        return reviewer.login.toLowerCase() == userLogin.toLowerCase();
                    }).length > 0;
                }
            }
        ];
				
		defaultFilter = defaultFilter || 0;
		this.filters[defaultFilter].isActive(true);
		this.activeFilter = ko.observable(this.filters[defaultFilter]);
		
        this.setActiveFilter = function (model) {
			this.activeFilter.peek().isActive(false);
			
			//NOTE: запоминаем выбранный фильтр в storage			
			this.setFilterIndex(self.filters.indexOf(model));
			
			model.isActive(true);
            this.activeFilter(model);
        }.bind(this);

        //NOTE: Фильтр по введенному тексту
        this.textForFilters = ko.observable("");
        this.propertyForFilters = ko.observable();


        this.filteredListOfPullRequest = ko.computed(function () {

            var result;

            if (self.activeFilter().filter) {
                result = self.list().filter(self.activeFilter().filter);
            } else {
                result = self.list();
            }

            if (self.textForFilters() != "") {
                result = result.filter(function (item) {
                    return item[self.propertyForFilters()]().indexOf(self.textForFilters()) != -1;
                });
            }
            return result;
        });

        ///NOTE: Выбранный pullRequest, для отображения подробной информации
        this.chosenPullRequest = ko.observable();
        this.setPullRequest = function (pullRequest) {
            self.chosenPullRequest(pullRequest);
        };


        ///NOTE: Разбиение на страницы

        //Количество записей на странице
        this.records = ko.observable(25);
        this.countRecords = ko.computed({
            read: function () {
                return self.records();
            },
            write: function (value) {
                if (value > 0) {
                    self.records(Math.ceil(value));
                }
            }
        });
        //Открытая страница
        this.pageNumber = ko.observable(1);
        this.setPage = function (page) {
            self.pageNumber(page.num);
        };
        //Количество страниц
        this.numberOfPages = ko.computed(function () {
            var num = Math.ceil(self.filteredListOfPullRequest().length / self.countRecords());

            if (self.pageNumber() > num && num != 0) {
                self.pageNumber(num);
            };
            return num;
        });

        //Записи для текущей страницы
        this.pullRequests = ko.computed(function () {
            var indexEnd = self.pageNumber() * self.countRecords();
            var indexBegin = indexEnd - self.countRecords();
            return self.filteredListOfPullRequest().slice(indexBegin, indexEnd);
        });


        //Кнопки для переключения страниц
        this.numberOfPagesButton = ko.computed(function () {
            var buttons = [];
            for (var i = 1; i <= self.numberOfPages() ; i++) {
                buttons.push({ num: i });
            };
            return buttons;
        });
    };
});