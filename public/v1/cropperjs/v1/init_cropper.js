var cropper = null;
var idnumber = null;
var is_uploader_active = 0;      
        
var $cropperModal = `
    <!-- CROPPER MODAL -->
    <div class="modal fade" role="dialog" id="cropperModal"  aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel">Crop the image</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                  <div class="img-container">
                    <img id="croppermodal_image" src="" style="max-width: 100%;">
                  </div>
 
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-danger" id="cropButton">Crop</button>
                </div>
              </div>

            </div>
        </div>
    </div>
    <!--/ CROPPER MODAL -->
`;

if ($('#cropperModal').length < 1) {
    $('body').append($cropperModal);
}

var selected_done = function (url, idnumber) {

    $('#input_' + idnumber).val('');
    //$('#cropper_img_' + idnumber).attr('src', url);
    $('#alert_' + idnumber).hide();
    $('#croppermodal_image').attr('src', url);
    $('#cropperModal').modal('show');
//    $progress = $('#progress_' + idnumber).show();
    console.log(url + '' + idnumber, 'selected_done');
};
function getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
}

/**
 * Image Uploader Input onchange
 */
$(document).on('change', '.cropperjs', function (e) {

    idnumber = $(this).data('idnumber');
    var files = e.target.files;
    var reader;
    var file;
    var url;
    if (files && files.length > 0) {
        file = files[0];
        if (URL) {
            selected_done(URL.createObjectURL(file), idnumber);
        } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function (e) {
                selected_done(reader.result, idnumber);
            };
            reader.readAsDataURL(file);
        }
    }


});
function getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
}

/**
 * satart CropperJS when Model opened
 */
$('#cropperModal').on('shown.bs.modal', function () {

    var image = document.getElementById('croppermodal_image');
    var croppable = false;
    var isrounded = $('#input_' + idnumber).data('isrounded');
    var minCroppedWidth = parseInt($('#input_' + idnumber).data('minw'));
    var minCroppedHeight = parseInt($('#input_' + idnumber).data('minh'));
    var maxCroppedWidth = parseInt($('#input_' + idnumber).data('maxw'));
    var maxCroppedHeight = parseInt($('#input_' + idnumber).data('maxh'));
    
    var fixedCropBox = parseInt($('#input_' + idnumber).data('fixedcropbox'));
    
    if(fixedCropBox === 1){
        
        cropper = new Cropper(image,  {
            dragMode: 'move',
            autoCropArea: 0.5,
            restore: false,
            guides: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false,
            ready: function () {
                croppable = true;
            },
            data: {
                width: maxCroppedWidth,
                height: maxCroppedHeight,
            }
        });
    }
    else{
        
        cropper = new Cropper(image, {
             
            viewMode: 3,

            data: {
              width: (minCroppedWidth + maxCroppedWidth) / 2,
              height: (minCroppedHeight + maxCroppedHeight) / 2,
            },

            crop: function (event) {
              var width = event.detail.width;
              var height = event.detail.height;

              if (
                width < minCroppedWidth
                || height < minCroppedHeight
                || width > maxCroppedWidth
                || height > maxCroppedHeight
              ) {
                cropper.setData({
                  width: Math.max(minCroppedWidth, Math.min(maxCroppedWidth, width)),
                  height: Math.max(minCroppedHeight, Math.min(maxCroppedHeight, height)),
                });
              }
               
            },
         });
    }
   
    
}).on('hidden.bs.modal', function () {
    cropper.destroy();
    cropper = null;
    
    if(is_uploader_active === 0){
        $('#progress_' + idnumber).hide();
    }
    
});
/**
 * Start Cropping
 */
$('#cropButton').on('click', function () {
    var canvas;
    var initialAvatarURL = $('#cropper_img_' + idnumber).attr('src'); //Inside Form
    var $progress = $('#progress_' + idnumber);
    var $progressBar = $('#progressbar_' + idnumber);
    var actionUrl = $('#input_' + idnumber).data('action');
    var fieldname = $('#input_' + idnumber).data('inputname'); //fieldname
    var isrounded = $('#input_' + idnumber).data('isrounded');
   
    var minCroppedWidth = parseInt($('#input_' + idnumber).data('minw'));
    var minCroppedHeight = parseInt($('#input_' + idnumber).data('minh'));
  
    is_uploader_active = 1; //disallow to hide progressbar by modal..
    $('#cropperModal').modal('hide');
    
    if (cropper) {
        
        $progress.show();

        canvas = cropper.getCroppedCanvas();
        
        $('#cropper_img_' + idnumber).attr('src', canvas.toDataURL());
        
        if (isrounded === 1) {
            canvas = getRoundedCanvas(canvas);
        }

        canvas.toBlob(function (blob) {

            var formData = new FormData();
            formData.append('file', blob, 'avatar.jpg');

            $.ajax(actionUrl, {
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                xhr: function () {
                    var xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = function (e) {
                        var percent = '0';
                        var percentage = '0%';
                        if (e.lengthComputable) {
                            percent = Math.round((e.loaded / e.total) * 100);
                            percentage = percent + '%';
                            $progressBar.width(percentage).attr('aria-valuenow', percent).text(percentage);
                        }
                    };
                    return xhr;
                },
                success: function (data) {
                    alertSuccess('Uploaded');
                    $('[name="' + fieldname + '"]').val(data['upload_data']['file_id']);
//                    $('#cropper_img_' + idnumber).attr('src', data['upload_data']['icon_url']);
                    $('#cropper_img_' + idnumber).attr('src', data['upload_data']['downloadUrl']);
                },
                error: function (jqXHR) {
                    $('#cropper_img_' + idnumber).attr('src', initialAvatarURL);
                    alertFail(_getApiErrorString(jqXHR));
                },
                complete: function () {
                    $progress.hide();
                    
                    is_uploader_active = 0;
                },
            });

        });
    }

});
