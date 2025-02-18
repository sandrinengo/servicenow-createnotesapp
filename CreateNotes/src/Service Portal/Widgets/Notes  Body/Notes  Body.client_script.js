function($scope,$rootScope, spModal, spUtil) {
	/* widget controller */
	var c = this;

	// Refactor
	// Initialize event listeners
	function initialize() {
		$rootScope.$on('selectNote', loadNote);
	}

	// Function to load a note
	function loadNote(event, data) {
		c.server.get({
			action: 'getNote',
			noteID: $rootScope.noteID
		}).then(updateNoteData);
	}

	// Update the controller data with the fetched note
	function updateNoteData(response) {
		c.data.title = response.data.note.title;
		c.data.note = response.data.note.note;
		c.data.noteID = response.data.note.sys_id;
	}

	// Function to update a note
	c.updateNote = function(updateType) {
		c.server.get({
			action: 'updateNote',
			noteID: c.data.noteID,
			noteBody: c.data.note,
			noteTitle: c.data.title
		}).then(function(response) {
			if (updateType === 'title' || updateType === 'body') {
				$rootScope.$emit('updateTitle', response.data);
			}
		});
	}

	// Confirm delete before proceeding
    c.confirmDelete = function() {
        spModal.confirm("Are you sure you want to delete this Note record?").then(function(confirmed) {
            if (confirmed) {
                deleteNote();
            }
        });
    }

	// Function to delete a note
	function deleteNote() {
		c.server.get({
			action: 'deleteNote',
			noteID: c.data.noteID
		}).then(resetNoteData);
	}

	// Reset the note fields after deletion
	function resetNoteData(response) {
		spUtil.addTrivialMessage("The "+c.data.title+" record has been deleted");
		$rootScope.$emit('deleteNote', c.data.noteID);
		c.data.title = '';
		c.data.note = '';
		c.data.noteID = '';
	}

	function deleteNoteWithConfirmation(){
		c.confirmDelete = function(){
			spModal.confirm("Are you sure you want to delete this Note record?").then(function(confirmed){
			if(confirmed){
			c.deleteNote();			
			}
			});
		}
		
		c.deleteNote = function() {
			c.server.get({
				action: 'deleteNote',
				noteID: c.data.noteID
			}).then(function(r) {
				spUtil.addTrivialMessage("The "+c.data.title+" record has been deleted");
				$rootScope.$emit('deleteNote', c.data.noteID);
				c.data.title = '';
				c.data.note = '';
				c.data.noteID = '';
			});
		}
	}

	initialize();
//deleteNoteWithConfirmation();	
}

