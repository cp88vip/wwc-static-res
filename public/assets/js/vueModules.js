



var _modal = [
	'<div class="modal fade"id="',
	'"tabindex="-1"role="dialog"aria-labelledby="editLabel"aria-hidden="true"><div class="modal-dialog w720"><div class="modal-content">',
	'</div></div></div>'
];
var _head = [
	'<div class="modal-header"><button type="button"class="close"data-dismiss="modal"aria-hidden="true">&times;</button><h4 class="modal-title"id="editLabel">',
	'</h4></div>'
];
var _body = [
	'<div class="modal-body"><form class="form"action="#"><table class="table table-striped table-bordered table-hover table-responsive table-noBottom">',

	'</table></form></div>'
];
var _userTemplate = '';

var _userRows = []
var userModule = {
	props: ["member", "levels", "action", "levelOptions"],
	data: function() {
		return {
			"modalId": "userModal"
		}
	},
	mounted: function() {
		// console.log("top ready");
		// if (this.headerData.notices.length == 0) {
		// 	this.headerData.notices.push({"issueTime": 1000, "content": "暂无新通告"});
		// }
		// console.log(this.action);
	},
	// watch: { // 监听 this
	// 	action: function (val) {
	// 		console.log(val + 1)
	// 	}
	// },
	methods: {
		show: function() {
			$("#"+this.modalId).modal();
		},
		close: function() {
			$("#"+this.modalId).modal("hide");
		}
	},
	template: ''
};


//user module
Vue.component('user-module', userModule);
/**/
