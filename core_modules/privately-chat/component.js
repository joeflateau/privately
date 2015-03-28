ko.components.register('chat',  {
	viewModel: function(params){
		var vm = this;
		vm.messages = ko.observableArray([]);
		vm.message = ko.observable();
		var io = params.io;

		io.on('received', function(message){
			vm.messages.push(message);
		});
		io.on('messages', function(messages){
			vm.messages(messages);
		});
		
		vm.send = function(){
			io.emit('send', { text: vm.message() });
			vm.message("");
		}

		io.emit("listmessages");

		this.dispose = function(){
			io.off();
		}
	},
	template: '\
		<div class="col-md-12"> \
			<div class="panel panel-primary"> \
				<div class="panel-heading"> \
					<h3 class="panel-title">Chat</h3> \
				</div> \
				<div class="panel-body"> \
					<ul data-bind="foreach: messages" class="tall list-group"> \
						<li class="list-group-item" data-bind="text: text"></li> \
					</ul> \
				</div> \
				<div class="panel-footer"> \
					<form> \
						<div class="input-group"> \
							<input type="text" data-bind="value: message" class="form-control"> \
							<div class="input-group-btn"> \
								<button data-bind="click: send" class="btn btn-default">Send</button> \
							</div> \
						</div> \
					</form> \
				</div> \
			</div> \
		</div>' 
});