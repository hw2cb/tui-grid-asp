const data = {
    display: {
        noData: 'Данных нет',
        loadingData: 'Загрузка данных',
        resizeHandleGuide:
            'Вы можете изменять ширину колонки перетаскиванием мыши, а также инициализировать ширину двойным щелчком мыши',
    },
    net: {
        confirmCreate: 'Вы уверены, что хотите создать {{count}} данные?',
        confirmUpdate: 'Are you sure you want to update {{count}} data?',
        confirmDelete: 'Are you sure you want to delete {{count}} data?',
        confirmModify: 'Are you sure you want to modify {{count}} data?',
        noDataToCreate: 'No data to create.',
        noDataToUpdate: 'No data to update.',
        noDataToDelete: 'No data to delete.',
        noDataToModify: 'No data to modify.',
        failResponse: 'An error occurred while requesting data.\nPlease try again.',
    },
    // change the i18n what you want
    filter: {
        contains: 'Содержит',
        eq: 'Равно',
        ne: 'Не равно',
        start: 'Начинается с',
        end: 'Заканчивается на',
        after: 'После',
        afterEq: 'После или равняется',
        before: 'До',
        beforeEq: 'До или равняется',
        apply: 'Принять',
        clear: 'Очистить',
        selectAll: 'Выбрать все',
        emptyValue: 'Пустое значение',
    },
}

class CustomLinkRenderer {
    constructor(props) {
        const el = document.createElement('a');
        this.el = el;
        this.render(props);
    }
    getElement() {
        return this.el;
    }
    render(props) {
        this.el.innerHTML = String(props.value);
        this.el.href = "#";
    }
}
class CustomDateRenderer {
    constructor(props) {
        const el = document.createElement('span');
        this.el = el;
        this.render(props);
    }
    getElement() {
        return this.el;
    }
    render(props) {
        this.el.textContent = String(luxon.DateTime.fromISO(props.value).toFormat('yyyy.MM.dd'));
    }
}

class CustomCarLicRenderer {
    constructor(props) {
        const el = document.createElement('input');
        el.setAttribute("type", "checkbox");
        el.disabled = true;
        this.el = el;
        this.render(props);
    }
    getElement() {
        return this.el;
    }
    render(props) {
        if (props.value == true) {
            this.el.checked = true;
        }
        else { this.el.checked = false; }
        
    }
}


const dataSource = {
    api: {
        readData: { url:'https://localhost:7193/api/User/employees', method: 'GET' }
    },
};
const testData = [
    { name: "Test1", progress: 20, gender: "Male", rating: 4, col: "Pop", dob: '1991.10.10', car: true },
    { name: "Test2", progress: 35, gender: "Female", rating: 2, col: "Rap", dob: '1991.10.12', car: false },
    { name: "Test3", progress: 100, gender: "Male", rating: 1, col: "Hip-Hop", dob: '1991.10.14', car: true },
    { name: "Test4", progress: 89, gender: "Male", rating: 6, col: "Jazz", dob: '1991.10.15', car: true },
    { name: "Test5", progress: 90, gender: "Female", rating: 8, col: "Pop", dob: '1991.10.19', car: true },
    { name: "Test6", progress: 76, gender: "Male", rating: 9, col: "Hip-Hop", dob: '1991.10.20', car: false },
    { name: "Test7", progress: 14, gender: "Female", rating: 3, col: "Pop", dob: '1991.10.23', car: true },
    { name: "Test8", progress: 5, gender: "Male", rating: 5, col: "Rock", dob: '1991.10.23', car: true }

];
const grid = new tui.Grid({
    el: document.getElementById('content'),
    data: dataSource,
    columns: [
        {
            header: 'Имя',
            name: 'name',
            filter: { type: 'text', showApplyBtn: true, showClearBtn: true },
            sortable: true,
            renderer: {
                type: CustomLinkRenderer
            }
        },
        {
            header: 'Прогресс',
            name: 'progress',
            filter: { type:'number', showApplyBtn: true, showClearBtn: true },
            sortable: true
        },
        {
            header: 'Пол',
            name: 'gender',
            filter: 'select',
            sortable: true
        },
        {
            header: 'Рэйтинг',
            name: 'rating',
            filter: { type: 'number', showApplyBtn: true, showClearBtn: true, operator: 'OR' },
            sortable: true,
        },
        {
            header: 'Цвет',
            name: 'col',
            filter:'select',
            sortable:true
        },
        {
            header: 'Дата рождения',
            name: 'dob',
            filter: {
                type: 'date',
                options: {
                    format: 'yyyy.MM.dd',
                },
                operator: 'OR',
                showApplyBtn: true,
                showClearBtn: true
            },
            renderer: {
                type: CustomDateRenderer
            },
            sortable: true
        },
        {
            header: 'Вод. удост',
            name: 'car',
            filter: 'select',
            renderer: {
                type: CustomCarLicRenderer
            },
            sortable: true
        }
    ],
    summary: {
        height: 40,
        position: 'bottom',
        columnContent: {
            name: {
                template: function (summary) {
                    return 'Кол. стр: ' + summary.cnt;
                }
            },
            progress: {
                template: function (summary) {
                    return `Макс. знач: ${summary.max}<br>Мин. знач: ${summary.min}`;
                }
            },
            rating: {
                template: function (summary) {
                    return 'Сред. знач: ' + summary.avg;
                }
            }
        }
    },
    columnOptions: {
        resizable:true
    },
    rowHeaders: ['checkbox'],
    pageOptions: {
        useClient: true,
        perPage:10
    },
    contextMenu:null
});

tui.Grid.setLanguage('en', data);


//Custom position filter for column Rating
$('#ratingFilterButtonApprove').on('click', function () {
    const filterOpt = {
        type: 'number',
        showApplyBtn: true,
        showClearBtn: true,
        operator: 'AND'
    }
    const value1 = $('#ratingFilterValue1').val();
    const value2 = $('#ratingFilterValue2').val();
    const state =
    [
        { value: value1, code: 'gte' },
        { value: value2, code: 'lte' }
        ];
    grid.setFilter('rating', filterOpt);
    grid.filter('rating', state);
});
$('#ratingFilterButtonClear').on('click', function () {
    grid.unfilter('rating');
    resetSummaryStrCount();
    $('#ratingFilterValue1').val('');
    $('#ratingFilterValue2').val('');
});
//Custom position filter for column Дата рождения
var today = new Date();
var picker = tui.DatePicker.createRangePicker({
    startpicker: {
        input: '#startpicker-input',
        container: '#startpicker-container'
    },
    endpicker: {
        input: '#endpicker-input',
        container: '#endpicker-container'
    },
    format: 'yyyy.MM.dd'
});

function changeFilter() {
    const filterOpt = {
        type: 'date',
        options: {
            format: 'yyyy.MM.dd'
        },
        operator: 'AND',
        showApplyBtn: true,
        showClearBtn: true
    }
    const value1 = luxon.DateTime.fromISO(picker.getEndDate().toISOString()).toFormat('yyyy.MM.dd');
    const value2 = luxon.DateTime.fromISO(picker.getStartDate().toISOString()).toFormat('yyyy.MM.dd');
    const state =
        [
            { value: value2, code: 'afterEq' },
            { value: value1, code: 'beforeEq' }
        ];
    grid.setFilter('dob', filterOpt);
    grid.filter('dob', state);
}
$('#dobFilterButtonApprove').on('click', function () {
    changeFilter();
});
$('#dobFilterButtonClear').on('click', function () {
    grid.unfilter('dob');
    resetSummaryStrCount();
});

$('#exportCSVButton').on('click', function () {
    grid.export('csv');
});
$('#exportExcelButton').on('click', function () {
    grid.export('xlsx');
})

//picker.on('change:end', () => {
//    console.log(picker.getEndDate());
//    changeFilter();
//})
//picker.on('change:start', () => {
//    console.log(picker.getStartDate());
//    changeFilter();
//})


//

//Handler for event filter (example)
grid.on('filter', ev => {
    const countFilterColumn = grid.getFilteredData();
    grid.setSummaryColumnContent('name', {
        template(summary) {
            return 'Кол. стр: ' + countFilterColumn.length;
        }
    });
})
grid.on('afterUnfilter', ev => {
    console.log(ev);
})
function resetSummaryStrCount() {
    grid.setSummaryColumnContent('name', {
        template(summary) {
            return 'Кол. стр: ' + grid.getFilteredData().length;
        }
    });
}