var LOW_URL = 'https://project1.crud4.com/crud4core/en/low/';

var checkNameList = ["ssl", "dbconnection", "dbdata", "files", "company", "project", "subscription"];

function startProjectSeries() {

    var from = $('input[name="from"]').val();

    if (from < 2) {

        alert('AAAAA 1 OLMAZ');
        return;
    }

    var to = $('input[name="to"]').val();

    __createProjectSeries(from, to);
}

function __createProjectSeries(from, to) {

    request("project" + from, 'createSubDomain', function (projectName) {

        var projectID = projectName.match(/\d+$/)[0];

        $('#domainlist').prepend(projectRow(projectID));

        request('project' + projectID, 'createSubdomainDatabase', function () {
            request('project' + projectID, 'fillDatabase', function () {
                request('project' + projectID, 'createFiles', function () {
                    request('project' + projectID, 'updateSubdomainSsl', function () {

                        setTimeout(function () {
                            checkProject('project' + projectID)
                        }, 2000);

                        if (parseInt(projectID) < to) {
                            __createProjectSeries((parseInt(projectID) + 1), to);
                        }
                    });


                });


            });

        });

    });
}

function __deleteAll(subdomain) {

    request(subdomain, 'deleteDatabase', function (projectName) {

        request(subdomain, 'deleteFiles');

        request(subdomain, 'deleteDomain', function () {

            var projectID = subdomain.match(/\d+$/)[0];

            $('#subdomainrow_' + projectID).remove();

        });

    });
}

function addInfo(comment, subdomain, info, status) {

    var id = comment + subdomain;


    if (typeof status !== 'undefined') {
        status = 'alert-primary';
    } else if (status === 'err') {
        status = 'alert-danger';
    } else if (status === 'success') {
        status = 'alert-success';
    }

    if (typeof info === 'undefined') {
        info = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';
    }

    if ($('#' + id).length > 0) {
        $('#' + id).html(comment + ' ' + subdomain + ' ' + info).addClass(status);

    } else {

        $('#infoarea').prepend('<div id="' + id + '" class="alert ' + status + '" role="alert">' + comment + ' ' + subdomain + ' ' + info + '</div>');
    }

}

function confirmrequest(subdomain, comment) {

    var r = confirm("Are You Sure  to " + comment);
    if (r == true) {
        request(subdomain, comment, checkProject(subdomain));
    }

}


function singlerequest(subdomain, comment) {

    request(subdomain, comment, checkProject(subdomain));
}

function request(subdomain, comment, ondone) {

    //deleteDatabase deleteDomain deleteFiles

    var $url = LOW_URL + "request/" + comment + "/" + subdomain;

    addInfo(subdomain, comment);

    $.ajax({
        type: "POST",
        url: $url,
        data: '{"id":"1"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            if (isEmpty(data.stdout) && !isEmpty(data.stderr)) {

                addInfo(subdomain, comment, data.stderr, 'err');

            } else if (isEmpty(data.stdout) && data.code === 0) {

                addInfo(subdomain, comment, data.stdout, 'success');

            } else {
                addInfo(subdomain, comment, data.stdout, 'success');
            }

            if (typeof ondone === "function") {
                ondone(subdomain);
            }

        },
        error: function (data) {

            addInfo(subdomain, comment, 'TIMEOUT !ERROR!', 'err');

            if (typeof ondone === "function") {
                ondone(subdomain);
            }
        }

    });


}

function createSubDomain() {

    var projectID = $('input[name="projectid"]').val();

    request("project" + projectID, 'createSubDomain', function (projectName) {

        alert(projectName + ' Created');
    });

}

function projectRow(projectID) {

    var $string = '';
    var projectName = 'project' + projectID;

    $string += `<tr class="subdomainrow" id="subdomainrow_` + projectID + `"  data-project_id="` + projectID + `">`;
    $string += `<td>` + projectID + `</td>`;
    $string += `<td><a href="https://` + projectName + `.crud4.com/" target="_blank">` + projectName + `</a></td>`;
    $string += `<td id="ping_` + projectID + `"></td>`;
    $string += `<td id="check_ssl_` + projectID + `"></td>`;
    $string += `<td id="check_dbconnection_` + projectID + `"></div></td>`;
    $string += `<td id="check_dbdata_` + projectID + `"></td>`;
    $string += `<td id="check_files_` + projectID + `"></td>`;
    $string += `<td id="check_company_` + projectID + `"></td>`;
    $string += `<td id="check_project_` + projectID + `"></td>`;
    $string += `<td id="check_subscription_` + projectID + `"></td>`;

    $string += `<td>`;


    $string += `
  <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
  <button type="button" class="btn btn-secondary" data-action="checkProject" data-project="` + projectName + `"  title="Check Project"><i class="far fa-check-circle"></i></button>

  <div class="btn-group" role="group">
    <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">`
    $string += ` <a class="dropdown-item" type="button" data-action="request"       data-project="` + projectName + `" data-comment="getDomainInfo">Info</a> `;
    $string += ` <a class="dropdown-item" type="button" data-action="singlerequest" data-project="` + projectName + `" data-comment="updateSubdomainSsl">SSL</a>`;
    $string += ` <a class="dropdown-item" type="button" data-action="singlerequest" data-project="` + projectName + `" data-comment="createSubdomainDatabase" >Database</a>`;
    $string += ` <a  class="dropdown-item"type="button" data-action="singlerequest" data-project="` + projectName + `" data-comment="fillDatabase">Fill DB</a>`;
    $string += ` <a  class="dropdown-item"type="button" data-action="singlerequest" data-project="` + projectName + `" data-comment="createFiles">createFiles</a>`;
    $string += ` <a  class="dropdown-item"type="button" data-action="singlerequest" data-project="` + projectName + `" data-comment="updateCIversion">updateCIversion</a>`;
    $string += `<div class="dropdown-divider"></div>`;
    $string += ` <a  type="button" class="dropdown-item btn btn-warning" data-action="confirmrequest" data-project="` + projectName + `" data-comment="deleteDatabase" >Delete Database</a>`;
    $string += ` <a  type="button" class="dropdown-item btn btn-warning" data-action="confirmrequest" data-project="` + projectName + `" data-comment="dropProjectTables">Drop Tables</a>`;
    $string += ` <a  type="button" class="dropdown-item btn btn-info"    data-action="confirmrequest" data-project="` + projectName + `" data-comment="deleteFiles">Delete Files</a>`;
    $string += ` <a  type="button" class="dropdown-item btn btn-danger"  data-action="confirmrequest" data-project="` + projectName + `" data-comment="deleteDomain">Delete Domain</a>`;
    $string += ` <a  type="button" class="dropdown-item btn btn-danger"  data-action="__deleteAll"    data-project="` + projectName + `">__deleteAll</a>`;
    $string += ` </div>
  </div>
</div>`;

    $string += `</td>`;

    $string += `</tr>`;

    return $string;

}

function getSubdomainList() {

    $('#domainlist').html('Loading List..');

    $.getJSON( LOW_URL + "getSubdomainList", {}).done(function (data) {
        var sortable = [];

        $.each(data, function (key, val) {
            var subdomainName = val['name'];
            var projectName = subdomainName.split(".")[0];

            //filter only start with project
            if (projectName !== 'project1' && projectName.search("project") === 0) {
                var projectID = projectName.match(/\d+$/)[0];

                val['projectID'] = projectID;
                val['projectName'] = projectName;

                sortable[projectID] = val;
            }
        });


        sortable.reverse();

        var $string = ``;

        for (var key in sortable) {

            var subdomainName = sortable[key].name;
            var projectName = sortable[key].projectName;
            var projectID = sortable[key].projectID;

            $string += projectRow(projectID);
        }

        $('#domainlist').html($string);

//            checkAllProject(sortable);

    })
            .fail(function () {
                alert('FAIL');
            });
}

function checkProject(subdomain, ondone) {

    var $url = LOW_URL + "request/checkProject/" + subdomain;
    var $projectId = subdomain.match(/\d+$/)[0];

    // Show Loading
    for (key in checkNameList) {
        $('#check_' + checkNameList[key] + '_' + $projectId).html(`<div class = "spinner-grow spinner-grow-sm" role = "status"> <span class="sr-only">Loading...</span></div>`);
    }

    $.ajax({
        type: "POST",
        url: $url,
        data: '{"id":"1"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            var $projectId = data.projectId;
            var $projectName = 'project' + $projectId;

            for (key in checkNameList) {

                var name = checkNameList[key];

                var desc = '';
                if (typeof data[name]['desc'] != 'undefined') {

                    desc = data[name]['desc'];
                }

                if (data[name]['status'] == 1) {

                    var fulltext = `<i class="fas fa-check ml-1" style="color:green;cursor: pointer; " 
                                        data-container="body" data-toggle="popover" 
                                        data-html="true" 
                                        data-trigger="hover" 
                                        data-content='` + desc + `'
                                        data-original-title="" title="">
                                    </i>`;
                } else {

                    var fulltext = `<i class="fas fa-times ml-1" style="color:red; cursor: pointer;"
                                        data-container="body" data-toggle="popover" 
                                        data-html="true"
                                        data-trigger="hover"
                                        data-content='` + desc + `'
                                        data-original-title="" title="">
                                    </i>`;
                }

                $('#check_' + name + '_' + $projectId).html(fulltext);

            }

            $('[data-toggle="popover"]').popover();

            if (typeof ondone === "function") {
                ondone($projectName);
            }

        },
        error: function (data) {
            
            console.log("fail" + $projectId);
            //alert("fail" + $projectId);
        },
        always: function (data) {
        }
    });
}

function checkAllProject(iteration) {

    if (typeof iteration !== 'undefined') {
        var project_id = iteration;
    } else {
        //First one
        var project_id = $(".subdomainrow").first().data('project_id');

        pingAll();
    }

    if (typeof project_id !== 'undefined') {

        checkProject('project' + project_id, function () {

            if ($('#subdomainrow_' + project_id).next('.subdomainrow').length > 0) {
                var nextId = $('#subdomainrow_' + project_id).next('.subdomainrow').data('project_id');
                checkAllProject(nextId);
            } else {

                console.log('LAST');
            }
        });
    }

//        for (var key in sortable) {
//            let subdomain = sortable[key].projectName;
//            checkProject(subdomain);
//        }

}


function updateAllRequest(requestComment, iteration) {

    if (typeof iteration !== 'undefined') {
        var project_id = iteration;
    } else {
        //First one
        var project_id = $(".subdomainrow").first().data('project_id');
    }


    if (typeof project_id !== 'undefined') {
        request('project' + project_id, requestComment, function () {

            if ($('#subdomainrow_' + project_id).next('.subdomainrow').length > 0) {
                var nextId = $('#subdomainrow_' + project_id).next('.subdomainrow').data('project_id');
                updateAllRequest(requestComment, nextId);
            } else {
                console.log('LAST');
            }
        });
    }
}

//    function updateAllCIversion(iteration) {
//
//        if (typeof iteration !== 'undefined') {
//            var project_id = iteration;
//        } else {
//            //First one
//            var project_id = $(".subdomainrow").first().data('project_id');
//        }
//
//        if (typeof project_id !== 'undefined') {
//            request('project' + project_id, 'updateCIversion', function () {
//
//                if ($('#subdomainrow_' + project_id).next('.subdomainrow').length > 0) {
//                    var nextId = $('#subdomainrow_' + project_id).next('.subdomainrow').data('project_id');
//                    updateAllCIversion(nextId);
//                } else {
//                    console.log('LAST');
//                }
//
//
//            });
//        }
//    }



function ping(project_id, ondone) {

    var url = 'https://project' + project_id + '.crud4.com';

    $.ajax({
        timeout: 5000,
        type: 'GET',
        dataType: 'jsonp',
        url: url,
        cache: false,
        complete: function (xhr, textStatus) {

            console.log('completecomplete');

            if (xhr.status == '200') {

                var fulltext = `<i class="fas fa-check ml-1" style="color:green;cursor: pointer; " 
                                        data-container="body" data-toggle="popover" 
                                        data-html="true" 
                                        data-trigger="hover" 
                                        data-content='` + xhr.status + `'
                                        data-original-title="" title="">
                                    </i>`;
            } else {

                var fulltext = `<i class="fas fa-times ml-1" style="color:red; cursor: pointer;"
                                        data-container="body" data-toggle="popover" 
                                        data-html="true"
                                        data-trigger="hover"
                                        data-content='` + xhr.status + `'
                                        data-original-title="" title="">
                                    </i>`;
            }

            $('#ping_' + project_id).html(fulltext);

            if (typeof ondone === "function") {
                ondone(project_id, 'complete');
            }
        }
    });
}

function pingAll(iteration) {

    if (typeof iteration !== 'undefined') {
        var project_id = iteration;
    } else {
        //First one
        var project_id = $(".subdomainrow").first().data('project_id');
    }

    if (typeof project_id !== 'undefined') {

        ping(project_id, function () {

            if ($('#subdomainrow_' + project_id).next('.subdomainrow').length > 0) {
                var nextId = $('#subdomainrow_' + project_id).next('.subdomainrow').data('project_id');
                pingAll(nextId);
            } else {
                console.log('LAST');
            }
        });
    }
}



document.addEventListener('DOMContentLoaded', function () {

    $(document).on('click', '[data-action="startProjectSeries"]', function () {
        event.preventDefault();
        startProjectSeries();
    });

    $(document).on('click', '[data-action="getSubdomainList"]', function () {
        event.preventDefault();
        getSubdomainList();
    });

    $(document).on('click', '[data-action="checkAllProject"]', function () {
        event.preventDefault();
        checkAllProject();
    });

    $(document).on('click', '[data-action="pingAll"]', function () {
        event.preventDefault();
        pingAll();
    });

    $(document).on('click', '[data-action="updateAllRequest"]', function () {
        event.preventDefault();
        var comment = $(this).data('comment');
        updateAllRequest(comment);
    });

    $(document).on('click', '[data-action="confirmrequest"]', function () {
        event.preventDefault();

        var comment = $(this).data('comment');
        var project = $(this).data('project');

        confirmrequest(project, comment);
    });

    $(document).on('click', '[data-action="singlerequest"]', function () {
        event.preventDefault();

        var comment = $(this).data('comment');
        var project = $(this).data('project');

        singlerequest(project, comment);
    });

    $(document).on('click', '[data-action="request"]', function () {
        event.preventDefault();

        var comment = $(this).data('comment');
        var project = $(this).data('project');

        request(project, comment);
    });

    $(document).on('click', '[data-action="__deleteAll"]', function () {
        event.preventDefault();
     
        var project = $(this).data('project');

        __deleteAll(project);
    });

    $(document).on('click', '[data-action="checkProject"]', function () {
        event.preventDefault();
     
        var project = $(this).data('project');

        checkProject(project);
    });


    $('#seriesFrom').on('keyup', function () {
        $('#seriesTo').val($(this).val());
    });

    var lastProject = $('.projectrow').first().data('project_id');
    if (!isEmpty(lastProject)) {
        $('#seriesFrom').val(parseInt(lastProject) + 1);
        $('#seriesTo').val(parseInt(lastProject) + 1);
    }

});
