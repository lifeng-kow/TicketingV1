var appCookie;

$(function(){

  appCookie = Cookies.getJSON('appCookie');
  if (appCookie.personID) {
     GetBasicInformation(appCookie.personID);
  }

  $('#passwordForm,#changeMyPwd').keyup(function(e){
    if(e.keyCode == 13){
      var NewUserName, Password;
      NewUserName = $('#newUserName').val();
      Password = $('#newPassword').val();
      if (checkPassword()){
        changeMyPwd(NewUserName, Password);
      }
    }
  });
  $('#passwordForm #passwordSubmit, #changeMyPwd #submit').click(function(){
    var NewUserName, Password;
    NewUserName = $('#newUserName').val();
    Password = $('#newPassword').val();
    if (checkPassword()){
      changeMyPwd(NewUserName, Password);
    }
  });
});//onready

function getOrgnisationInfo(PersonID){
  var data = {'PersonID':PersonID};
  $.ajax({
    url: "/Support/BCMain/iCtc1.GetOrganisationInfo.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: { 'data':JSON.stringify(data),
            'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
            'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277' },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var organisationInfo = data.d.RetData.Tbl.Rows[0];
          showOrgProfile();
          $('.orgName').html(organisationInfo.DisplayName);
          $('.idType').html(organisationInfo.EntityKeyType);
          $('.entityKey').html(organisationInfo.EntityKey);
          $('.orgContact').html(organisationInfo.Tel1);
          $('.orgEmail').html(organisationInfo.Email1);
          $('.orgAddress').html(organisationInfo.FullAddress);
          $('#name').val(organisationInfo.DisplayName);
          $('#entityKey').val(organisationInfo.EntityKey);
          $('#tel1').val(organisationInfo.Tel1);
          $('#email').val(organisationInfo.Email1);
          $('#address').val(organisationInfo.FullAddress);
        }
      }
    }
  });
};

function getPointofContact(PersonID){
  var data = {'PersonID':PersonID};
  $.ajax({
    url: "/Support/BCMain/iCtc1.GetPointOfContactInfo.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: {'data':JSON.stringify(data),
          'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
          'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'},
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var pointOfContact = data.d.RetData.Tbl.Rows[0];
          showOrgContact();
          $('.poc1Name').html(pointOfContact.POCName);
          $('.poc1Contact').html(pointOfContact.POCContact);
          $('.poc1Email').html(pointOfContact.POCEmail);
          $('.poc1Designation').html(pointOfContact.POCDesi);
          $('.poc1Department').html(pointOfContact.POCDept);
          $('.poc2Name').html(pointOfContact.POCName1);
          $('.poc2Contact').html(pointOfContact.POCContact1);
          $('.poc2Email').html(pointOfContact.POCEmail1);
          $('.poc2Designation').html(pointOfContact.POCDesi1);
          $('.poc2Department').html(pointOfContact.POCDept1);

          $('#poc1Name').val(pointOfContact.POCName);
          $('#poc1Contact').val(pointOfContact.POCContact);
          $('#poc1Email').val(pointOfContact.POCEmail);
          $('#poc1Designation').val(pointOfContact.POCDesi);
          $('#poc1Department').val(pointOfContact.POCDept);
          $('#poc2Name').val(pointOfContact.POCName1);
          $('#poc2Contact').val(pointOfContact.POCContact1);
          $('#poc2Email').val(pointOfContact.POCEmail1);
          $('#poc2Designation').val(pointOfContact.POCDesi1);
          $('#poc2Department').val(pointOfContact.POCDept1);
        }
      }
    }
  });
};

function changeMyPwd(Username, Password){
  var data = { "Username": Username, "Password": Password };
  $.ajax({
    url: "/Support/BCMain/iCtc1.ChangeUsernamePassword.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: { 'data': JSON.stringify(data),
            'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
            'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277' },
    success: function(data){
      window.location = '/profile.html';
    },
    error: function(XMLHttpRequest, data, errorThrown){
      alert("Error: " + errorThrown);
    }
  })
}

function checkPassword() {
	var NewPassword = $('#newPassword').val(),
      ConfirmPassword = $('#newPasswordConfirm').val();
	if (NewPassword === '') {
		alert('New password is required.');
    return false;
	} else if (ConfirmPassword === ''){
    alert('Confirm password is required.');
    return false;
  }else if (NewPassword != ConfirmPassword) {
    alert('Two passwords do not match.');
    return false;
	}else{
    return true;
  }
}

function GetBasicInformation(personID) {
  var data = {'PersonID': personID};
  $.ajax({
    url: "/Support/BCMain/iCtc1.GetPersonalInfo.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: { 'data': JSON.stringify(data),
            'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
            'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277' },
    success: function(data){
      if ((data) && (data.d.RetData.Tbl.Rows.length > 0)) {
        var personalInfo = data.d.RetData.Tbl.Rows[0];
        if (personalInfo.EntityType == 'O'){
          getOrgnisationInfo(appCookie.personID);
          getPointofContact(appCookie.personID);
        }else{
          showIndProfile();
          $('.indName').html(personalInfo.DisplayName);
          $('.indTel').html(personalInfo.Tel1);
          $('.indMobile').html(personalInfo.Mobile);
          $('.indEmail').html(personalInfo.Email1);
          $('.indAddress').html(personalInfo.FullAddress);
          $('#name').val(personalInfo.DisplayName);
          $('#tel1').val(personalInfo.Tel1);
          $('#mobile').val(personalInfo.Mobile);
          $('#email').val(personalInfo.Email1);
          $('#address').val(personalInfo.FullAddress);
        }
      }
    },
    error: function(XMLHttpRequest, data, errorThrown){
      alert("Error: " + errorThrown);
    }
  }).fail(function( jqXHR, textStatus ) {
    console.log( "Login fail" );
    console.log(jqXHR);
    console.log( "Request failed: " + textStatus );
  });
}

function updateIndBasic(PersonID){
  var name, tel1, mobile, email, address;
  name = $('#name').val();
  tel1 = $('#tel1').val();
  mobile = $('#mobile').val();
  email = $('#email').val();
  address = $('#address').val();
  var data = { "PID": PersonID, "name": name, "tel1": tel1, "mobile": mobile, "email": email, "address": address };
  $.ajax({
    url: "/Support/BCMain/iCtc1.UpdateIndBasic.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: { 'data': JSON.stringify(data),
            'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
            'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277' },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            location.reload();
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(XMLHttpRequest, data, errorThrown){
      alert("Error: " + errorThrown);
    }
  })
}

function updateOrgBasic(PersonID){
  var name, entityKey, tel1, email, address;
  name = $('#name').val();
  entityKey = $('#entityKey').val();
  tel1 = $('#tel1').val();
  email = $('#email').val();
  address = $('#address').val();
  var data = { "PID": PersonID, "name": name, "entityKey": entityKey, "tel1": tel1, "email": email, "address": address };
  $.ajax({
    url: "/Support/BCMain/iCtc1.UpdateOrgBasic.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: { 'data': JSON.stringify(data),
            'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
            'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277' },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            location.reload();
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(XMLHttpRequest, data, errorThrown){
      alert("Error: " + errorThrown);
    }
  })
}

function updateContactPoint(PersonID){
  var poc1Name, poc1Contact, poc1Email, poc1Designation, poc1Department, poc2Name, poc2Contact, poc2Email, poc2Designation, poc2Department;
  poc1Name = $('#poc1Name').val();
  poc1Contact = $('#poc1Contact').val();
  poc1Email = $('#poc1Email').val();
  poc1Designation = $('#poc1Designation').val();
  poc1Department = $('#poc1Department').val();
  poc2Name = $('#poc2Name').val();
  poc2Contact = $('#poc2Contact').val();
  poc2Email = $('#poc2Email').val();
  poc2Designation = $('#poc2Designation').val();
  poc2Department = $('#poc2Department').val();

  var data = { "PID": PersonID, "poc1Name": poc1Name, "poc1Contact": poc1Contact, "poc1Email": poc1Email, "poc1Designation": poc1Designation, "poc1Department": poc1Department, "poc2Name": poc2Name, "poc2Contact": poc2Contact, "poc2Email": poc2Email, "poc2Designation": poc2Designation, "poc2Department": poc2Department };
  $.ajax({
    url: "/Support/BCMain/iCtc1.UpdateContactPoint.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: { 'data': JSON.stringify(data),
            'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
            'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277' },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            location.reload();
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(XMLHttpRequest, data, errorThrown){
      alert("Error: " + errorThrown);
    }
  })
}

function showOrgProfile(){
  var orgProfile = '';
  orgProfile = '<div class="toggleContent"><div id="basicContent" class="grid-container form">'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Name </div> <div class="text orgName"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> ID Type </div> <div class="text idType"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> UEN No </div> <div class="text entityKey"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Contact No </div> <div class="text orgContact"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"><div class="labelText"> Email </div> <div class="text orgEmail"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Address </div> <div class="text orgAddress"> </div> </div> </div> </div>'+
  '<form id="basicForm" class="grid-container">'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="name"> Name </label> <input type="text" id="name"/> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="tel1"> UEN No </label> <input type="text" id="entityKey"/> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="tel1"> Contact No </label> <input type="text" id="tel1"/> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="email"> Email </label> <input type="text" id="email"/> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="address"> Address </label> <input type="text" id="address"/> </div> </div>'+
  '<footer class="grid-x grid-padding-x"> <button type="button" id="basicSubmit" data-close class="btn cell small-12 medium-offset-4 medium-4">Submit</button> </footer> </form> </div>';

  $('#profileData').append(orgProfile);
  $('#basicForm').hide();
  $('#basicSubmit').click(function(){
    updateOrgBasic(appCookie.personID);
  });
}

function showIndProfile(){
  var indProfile = '';
  indProfile = '<div class="toggleContent"><div id="basicContent" class="grid-container form">'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Name </div> <div class="text indName"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Contact No (O) </div> <div class="text indTel"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Contact No (M) </div> <div class="text indMobile"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Email </div> <div class="text indEmail"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Address </div> <div class="text indAddress"> </div> </div> </div> </div>'+
  '<form id="basicForm" class="grid-container">'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="name"> Name </label> <input type="text" id="name"/> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="tel1"> Contact No (O) </label> <input type="text" id="tel1"/> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="mobile"> Contact No (M) </label> <input type="text" id="mobile"/> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="email"> Email </label> <input type="text" id="email"/> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="address"> Address </label> <input type="text" id="address"/> </div> </div>'+
  '<footer class="grid-x grid-padding-x"> <button type="button" id="basicSubmit" data-close class="btn cell small-12 medium-offset-4 medium-4">Submit</button> </footer> </form> </div>';

  $('#profileData').append(indProfile);
  $('#basicForm').hide();
  $('#contactPointData').hide();
  $('#basicSubmit').click(function(){
    updateIndBasic(appCookie.personID);
  });
}

function showOrgContact(){
  var contactPoint = '';
  contactPoint='<div class="toggleContent"><div id="contactPointContent" class="grid-container form">'+
  '<h3>Point of Contact 1</h3>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Name </div> <div class="text poc1Name"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Contact No </div> <div class="text poc1Contact"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Email </div> <div class="text poc1Email"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Designation </div> <div class="text poc1Designation"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Department </div> <div class="text poc1Department"> </div> </div> </div>'+
  '<h3>Point of Contact 2</h3>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Name </div> <div class="text poc2Name"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Contact No </div> <div class="text poc2Contact"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Email </div> <div class="text poc2Email"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Designation </div> <div class="text poc2Designation"> </div> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <div class="labelText"> Department </div> <div class="text poc2Department"> </div> </div> </div> </div>'+
  '<form id="contactPointForm" class="grid-container">'+
  '<h3>Point of Contact 1</h3>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc1Name"> Name </label> <input type="text" id="poc1Name" /> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc1Contact"> Contact No  </label> <input type="text" name="poc1Contact" id="poc1Contact" /> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc1Email"> Email </label> <input type="text" id="poc1Email" /> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc1Designation"> Designation </label> <input type="text" id="poc1Designation" /> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc1Department"> Department </label> <input type="text" id="poc1Department" /> </div> </div>'+
  '<h3>Point of Contact 2</h3>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc2Name"> Name </label> <input type="text" id="poc2Name" /> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc2Contact"> Contact No  </label> <input type="text" id="poc2Contact" /> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc2Email"> Email </label> <input type="text" id="poc2Email" /> </div> </div>'+
  '<div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc2Designation"> Designation </label> <input type="text" id="poc2Designation" />'+
  '</div> </div> <div class="grid-x grid-padding-x"> <div class="cell"> <label for="poc2Department"> Department </label> <input type="text" id="poc2Department" /> </div> </div>'+
  '<footer class="grid-x grid-padding-x"> <button type="button" id="pocSubmit" data-close class="btn cell small-12 medium-offset-4 medium-4"> Submit </button> </footer> </form> </div>';

  $('#contactPointData').append(contactPoint);
  $('#contactPointForm').hide();
  $('#pocSubmit').click(function(){
    updateContactPoint(appCookie.personID);
  });
}
