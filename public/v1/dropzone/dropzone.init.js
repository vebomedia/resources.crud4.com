function init_dropzone() {

    console.log('dropzone_inited');

    if ($('.dropzone').length > 0) {

        $(".dropzone:not(.dz-clickable)").each(function (index) {

            var id = $(this).attr('id');
            var ismultiple = $(this).data('ismultiple');
            var tablename = $(this).data('tablename');
            var maxFiles = $(this).data('maxfiles');
            var acceptedFiles = $(this).data('acceptedfiles');
            var dictDefaultMessage = $(this).data('message');
            var $inputName = $(this).data('inputname'); //could be multiple fieldname

            if (dictDefaultMessage === '') {
                $('.dz-message').hide();
            } else {
                $('.dz-message').show();
            }

            var $csrf_meta = $('#csrf_header');

            new Dropzone("#" + id, {
                dictDefaultMessage: dictDefaultMessage,
                paramName: "file", // The name that will be used to transfer the file
                maxFiles: maxFiles,
                maxFilesize: 10, // MB
                parallelUploads: 1,
                // addRemoveLinks: true,
                acceptedFiles: acceptedFiles,
                autoDiscover: false,
                createImageThumbnails: false,

                headers: {
                    [$csrf_meta.attr("name")]: $csrf_meta.attr("content")
                },
                init: function () {

                    $('.dz-details').remove();

                    this.on("removedfile", function (file) {
                        console.log('removedfile');
                    });

                    this.on("maxfilesexceeded", function (file) {
                        alertFail('maxfilesexceeded  ' + maxFiles + ' File');
                        this.removeFile(file);
                    });
                    this.on('completemultiple', function (file, json) {

                    });
                    this.on('addedfile', function (file, json) {
                        $('.dz-details').remove();
                    });
                    this.on('error', function (file, json) {
                        this.removeFile(file);
                        alertFail(_getApiErrorString(json));
                    });
                    this.on("success", function (file, json) {

                        var upload_data = json['upload_data'];
                        var file_id = upload_data.file_id;
                        var downloadUrl = upload_data.downloadUrl;
                        var icon_url = upload_data.icon_url;
                        var deleteUrl = upload_data.deleteUrl;

                        file.previewElement.id = file_id;
                        var div = document.createElement('div');

                        div.innerHTML = `<div class="pt-1 align-middle text-center">
                                            <a href="` + deleteUrl + `" id="file_` + file_id + `" 
                                                data-action="apirequest"
                                                data-deleteline=".dz-preview"
                                                data-question="areyousure_deletefile"
                                                data-subtitle="can_not_be_undone"
                                                data-usehomelang="true"
                                                data-ajaxmethod="DELETE"
                                                data-fileid="` + file_id + `"
                                                data-datatable="table_user"
                                                data-actionurl="` + deleteUrl + `"
                                                title="Delete" class="btn btn-secondary btn-sm" data-dz-remove>
                                                <i class="fa fa-trash"></i>
                                            </a>
                                            <a href="` + downloadUrl + `" target="_blank" download 
                                                title="Download" 
                                                class="btn btn-warning btn-sm">
                                                <i class="fa fa-download"></i>
                                            </a>
                                    
                                            <input type="hidden" name="` + $inputName + `" value="` + file_id + `"></input>      
                                        </div>`;
                        file.previewTemplate.appendChild(div);
                        file.previewElement.querySelector("img").classList.add('float-left');
                        file.previewElement.querySelector("img").classList.add('img-thumbnail');
                        file.previewElement.querySelector("img").src = icon_url;


                        $(".dz-image").addClass('d-flex justify-content-center');

                    })
                }
            });


            $('.sortable').sortable({

                update: function () {

                    $.post(panel_url(tablename + '/updateFileOrder'), {order: $(this).sortable('toArray')}, ).done(function (data) {

                        alertSuccess(_getApiSuccessString(data));

                    }).fail(function (jqXHR) {

                        alertFail(_getApiErrorString(jqXHR));

                    });
                }
            });

        });

    }
}