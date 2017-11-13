
$(function(){
  //get cookie
  var appCookie = Cookies.getJSON('appCookie');
  //get loginid
  var loginID = appCookie.loginID;

  var urlParams = new URLSearchParams(window.location.search);
  var packageID = urlParams.get('packageID');


  var pageName = getPageName();
  if (pageName == 'packages'){
    getPackageList('', '', '', '', '',loginID);
  }else if (pageName == 'packageDetails'){
    if (packageID){
      getPackageDetails(packageID, loginID)
    }
  }else{
    getCurrentPackageList(loginID);
  }
  //filter
  $('#packageFilterForm .tabBoxButtonSubmit').click(function(){
    var targetRef = $(this).parents('.tabBoxContent');
    var Organization, Product, Status, DateFrom, DateTo;
    Organization = $('#packageFilterForm #organisation').val();
    Product = $('#packageFilterForm #product').val();
    if ($('input[name="status"]:checked').length > 0){
      Status = 'Active';
    }else{
      Status = '';
    }
    DateFrom = $('#packageFilterForm #packageStartDate').val();
    DateTo = $('#packageFilterForm #packageExpiryDate').val();
    getPackageList(Organization, Product, Status, DateFrom, DateTo, loginID);
  });
  //add package
  $('#packageAddForm #submit').click(function(){
    var RoleID, Type, Product, System, BoughtManDays, Status, StartDate, ExpiryDate;
    RoleID = $('#packageAddForm #organisation').val();
    Type =  $('#packageAddForm #type').val();
    Product = $('#packageAddForm #product').val();
    System = $('#packageAddForm #system').val();
    BoughtManDays = $('#packageAddForm #manDays').val();
    StartDate = $('#packageAddForm #packageStartDate').val();
    ExpiryDate = $('#packageAddForm #packageExpiryDate').val();
    addNewPackage(RoleID, Type, Product, System, BoughtManDays, StartDate, ExpiryDate, loginID);
  });
  //add transaction
  $('#packageTransactionAddForm #submit').click(function(){
    var Type, ManDays, Remarks;
    Type =  $('#packageTransactionAddForm #type').val();
    ManDays = $('#packageTransactionAddForm #manDays').val();
    Remarks = $('#packageTransactionAddForm #remarks').val();
    addNewtransaction(packageID, '', Type, ManDays, Remarks, loginID);
  });
});

function getPageName() {
  var pageName = $('body').attr('id').replace('page-','');
  return pageName;
}

function addNewPackage(RoleID, Type, Product, System, BoughtManDays, StartDate, ExpiryDate, LoginID){
  var data = {'RoleID':RoleID, 'Type':Type, 'Product':Product, 'System': System,
              'BoughtManDays': BoughtManDays, 'StartDate':StartDate,
              'ExpiryDate':ExpiryDate, 'LoginID':LoginID};
  $.ajax({
    url: "https://portal.taksys.com.sg/Support/BCMain/Ctc1.AddNewPackage.json",
    method: "POST",
    dataType: "json",
    data: {'data':JSON.stringify(data),
          'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
          'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'},
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            getPackageList('', '', '', '', '', LoginID);
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    }
  });
}

//Get All Package List
function getPackageList(Organisation, Product, Status, StartDate, ExpiryDate, LoginID){
  var data = {'Organisation':Organisation, 'Product':Product, 'Status':Status, 'StartDate':StartDate, 'ExpiryDate':ExpiryDate, 'LoginID':LoginID};
  $.ajax({
    url: "https://portal.taksys.com.sg/Support/BCMain/Ctc1.GetPackageList.json",
    method: "POST",
    dataType: "json",
    data: {'data':JSON.stringify(data),
          'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
          'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'},
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        var htmlString = '';
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var packages = data.d.RetData.Tbl.Rows;
          var htmlString = '';
          for (var i=0; i<packages.length; i++ ){
            var startDate = convertDateTime(packages[i].StartDate,'date');
            var expiryDate = convertDateTime(packages[i].ExpiryDate,'date');
            htmlString += '<tr id="'+ packages[i].PackageID  +'">';
            htmlString += '<td>'+packages[i].Organization+'</td>';
            htmlString += '<td>'+packages[i].BoughtManDays+'</td>';
            htmlString += '<td>'+packages[i].Product+'</td>';
            htmlString += '<td>'+packages[i].System+'</td>';
            htmlString += '<td>'+startDate+'</td>';
            htmlString += '<td>'+expiryDate+'</td>';
            htmlString += '<td>'+packages[i].Status+'</td>';
            htmlString += '</tr>';
          }
          $('.packageTable tbody').html(htmlString);
          $('.packageTable tbody tr').click(function(){
            var packageId = $(this).attr('id');
            var packageUrl = '/packageDetails.html?packageID=' + packageId
            window.location.href = packageUrl;
          });
        }
      }
    }
  });
};

//get Current Package List
function getCurrentPackageList(LoginID){
  var data = {'LoginID':LoginID};
  $.ajax({
    url: "https://portal.taksys.com.sg/Support/BCMain/Ctc1.GetCurrentPackages.json",
    method: "POST",
    dataType: "json",
    data: {'data':JSON.stringify(data),
          'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
          'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'},
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var packages = data.d.RetData.Tbl.Rows;
          var htmlString = '';
          for (var i=0; i<packages.length; i++ ){
            var date = convertDateTime(packages[i].ExpiryDate,'date');
            htmlString += '<div class="medium-6 large-4 cell clearfix"> <div class="card"> <div class="grid-x card-divider"> <div class="cell auto">'
						htmlString +=	'<h3 class="colorCodeGreen">'+packages[i].Product+'</h3>'
            if (packages[i].System.length > 0) {
              htmlString +=	'<ul class="system">'
  						htmlString +=	'<li>'+packages[i].System+'</li>'
  						htmlString +=	'</ul>'
            }
            htmlString +=	'</div>'
            if (packages[i].ManDaysLeft > 0) {
              htmlString += '<div class="manDays cell small-4"> <div class="grid-y" style="height: 60px;">'
              htmlString += '<div class="cell small-9"><b>'+packages[i].ManDaysLeft+'</b>/<span class="totalDays">'+packages[i].BoughtManDays+'</span></div> <small class="cell small-3">Man Days</small> </div> </div>'
            }
            htmlString += '</div><!--card-divider--> <div class="card-section">'
						htmlString +=	'<div class="packageType">'+packages[i].Type+'</div>'
						htmlString +=	'<div class="expiring">Expiring: <i>'+date+'</i></div>'
						htmlString += '</div> <!--card-section--></div> <!--card--></div> <!--cell-->'
          }
          $('.packageGrid').append(htmlString);
        }
      }
    }
  });
};

function addNewtransaction(PackageID, FLID, Type, ManDays, Remarks, LoginID){
  var data = {'PackageID':PackageID, 'FLID':FLID, 'Type':Type, 'ManDays':ManDays, 'Remarks': Remarks, 'LoginID':LoginID};
  $.ajax({
    url: "https://portal.taksys.com.sg/Support/BCMain/Ctc1.AddNewPackageTransactions.json",
    method: "POST",
    dataType: "json",
    data: {'data':JSON.stringify(data),
          'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
          'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'},
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            getPackageDetails(PackageID, LoginID);
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    }
  });
}

function getPackageDetails(PackageID, LoginID){
  var data = {'PackageID':PackageID, 'LoginID':LoginID};
  $.ajax({
    url: "https://portal.taksys.com.sg/Support/BCMain/Ctc1.GetPackagedetails.json",
    method: "POST",
    dataType: "json",
    data: {'data':JSON.stringify(data),
          'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
          'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'},
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        var htmlString = '';
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var packageDetails = data.d.RetData.Tbl.Rows;
          var htmlString = '';
          for (var i=0; i<packageDetails.length; i++ ){
            var packageDate = convertDateTime(packageDetails[i].CreatedDate,'datetime');
            var startDate = convertDateTime(packageDetails[i].StartDate,'date');
            var expiryDate = convertDateTime(packageDetails[i].ExpiryDate,'date');
            $('.organization').html(packageDetails[i].Organization);
            $('.packageType').html(packageDetails[i].Type);
            $('.product').html(packageDetails[i].Product);
            $('.system').html(packageDetails[i].System);
            $('.status').html(packageDetails[i].Status);
            $('.manDays').html(packageDetails[i].ManDaysLeft+'/'+packageDetails[i].BoughtManDays);
            $('.startDate').html(startDate);
            $('.expiryDate').html(expiryDate);
            $('.pkgCreatedBy').html(packageDetails[i].PkgCreatedBy);
            $('.createdDate').html(packageDate);
            var tranDate = convertDateTime(packageDetails[i].TranDate,'date');
            htmlString += '<tr id="'+ packageDetails[i].PackageID  +'">';
            htmlString += '<td>'+packageDetails[i].TranType+'</td>';
            htmlString += '<td>'+packageDetails[i].ManDays+'</td>';
            htmlString += '<td>'+packageDetails[i].Remarks+'</td>';
            htmlString += '<td>'+packageDetails[i].FLID+'</td>';
            htmlString += '<td>'+tranDate+'</td>';
            htmlString += '<td>'+packageDetails[i].TranCreatedBy+'</td>';
            htmlString += '</tr>';
          }
          $('.packagetranTable tbody').html(htmlString);
        }
      }
    }
  });
};

function convertDateTime(inputFormat, type) {
  if (inputFormat == null){
    return '-';
  };
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  if (type == 'date'){
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
  }else if (type == 'datetime'){
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/') + ' ' + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  }else if (type == 'time'){
    return [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  }
};
