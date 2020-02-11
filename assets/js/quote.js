$(document).ready(function () {
   
    console.log( "ready!" );
   
    $("#numElev_2, #numElev_3, #elevPriceUnit, #elevTotal, #installationFee, #total_").attr('readonly', true);

    var numApp, numFloors, numBase, numElev, maxOcc;
    var prodRange = {
        type: null,
        price: null,
        installationFeePercentage: null
    };

    $('.formField').on('keyup', function () {
        doCalc();
        console.log( "calculate" );
    });

    ///??????
    $('#standard').on('click', function () {

        document.getElementById('elevPriceUnit').value = (7565).toFixed(2) + " $";
        console.log( "elevPriceUnit" );
        doCalc();
    });
    $('#premium').on('click', function () {

        document.getElementById('elevPriceUnit').value = (12345).toFixed(2) + " $";
        console.log( "elevPriceUnit" );
         doCalc();
    });
     $('#excelium').on('click', function () {

        document.getElementById('elevPriceUnit').value = (15400).toFixed(2) + " $";
        console.log( "elevPriceUnit" );
        doCalc();

    });

    $('#residential, #commercial, #corporate, #hybrid').on('click', function () {
        console.log( "initialize" );
        initialize();
    });


    function initialize() {
        $('.formField').val('');
        $('.productRangeBtn').prop('checked', false);
        console.log( "initialize2" );
    };

    function getInfoNumApp() {
        numApp = $('#numApp').val();
        console.log( "numApp" );
    };

    function getInfoNumFloors() {
        numFloors = $('#numFloors').val();
        console.log( "numFloors" );
    };

    function getInfoNumBase() {
        numBase = $('#numBase').val();
        console.log( "numBase" );
    };

    function getInfoNumElev() {
        numElev = $('#numElev').val();
        console.log( "numElev" );
    };

    function getInfoMaxOcc() {
        maxOcc = $('#maxOcc').val();
        console.log( "maxOcc" );
    };

   
   
   // Selectiom of service
   
   
   
    function getProdRange() {
        if ($('#standard').is(':checked')) {
            prodRange.type = "standard";
            prodRange.price = parseFloat(7565);
            prodRange.installationFeePercentage = 0.1;
            console.log( "standard" );
            return prodRange;

        } if ($('#premium').is(':checked')) {
            prodRange.type = "premium";
            prodRange.price = parseFloat(12345);
            prodRange.installationFeePercentage = 0.13;
            console.log( "premium" );
            return prodRange;

        } if ($('#excelium').is(':checked')) {
            prodRange.type = "excelium";
            prodRange.price = parseFloat(15400);
            prodRange.installationFeePercentage = 0.16;
            console.log( "exelcelium" );
            return prodRange;
        } else {
            prodRange.type = null,
            prodRange.price = null,
            prodRange.installationFeePercentage = null
            console.log( "null" );
            return prodRange;
        }
    };

    function GetInfos() {
        getInfoNumApp();
        getInfoNumFloors();
        getInfoNumBase();
        getInfoNumElev();
        getInfoMaxOcc();
        getProdRange();
        console.log( "numElev" );
    };

    function setRequiredElevatorsResult(finNumElev) {
        $("#numElev_2, #numElev_3").val(parseFloat(finNumElev));
        console.log(finNumElev);
    };

    function setPricesResults(finNumElev, roughTotal, installFee, total) {
        $("#elevTotal").val(parseFloat(roughTotal).toFixed(2) + " $");
        console.log(roughTotal);
        $("#installationFee").val(parseFloat(installFee).toFixed(2) + " $");
        console.log(installFee);
        $("#total_").val(parseFloat(total).toFixed(2) + " $");
        console.log(total);
    };

    function emptyElevatorsNumberAndPricesFields() {
        $('#numElev_2').val('');
        $('#numElev_3').val('');
        $('.priceField').val('');
    };

    function createFormData(projectType) {
        return {
            numberApp: numApp,
            numberFloors: numFloors,
            numberBase: numBase,
            maximumOcc: maxOcc,
            numberElev: numElev,
            productRange: prodRange,
            projectType: projectType
        }
    };

// Fonction de veleur negative 


    function negativeValues() {
        if ($('#numApp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numApp').val('');
            return true
        } else if ($('#numBase').val() < 0) {

            alert("Please enter a positive number!");
            $('#numBase').val('');
            return true

        } else if ($('#numFloors').val() < 0) {

            alert("Please enter a positive number!");
            $('#numFloors').val('');
            return true

        } else if ($('#numComp').val() < 0) {

            alert("Please enter a positive number!");
            $('#numComp').val('');
            return true

        } else if ($('#numPark').val() < 0) {

            alert("Please enter a positive number!");
            $('#numPark').val('');
            return true

        } else if ($('#numElev').val() < 0) {

            alert("Please enter a positive number!");
            $('#numElev').val('');
            return true

        } else if ($('#numCorpo').val() < 0) {

            alert("Please enter a positive number!");
            $('#numCorpo').val('');
            return true

        } else if ($('#maxOcc').val() < 0) {

            alert("Please enter a positive number!");
            $('#maxOcc').val('');
            return true
        } else {
            return false
        }
    };

    function apiCall(projectType) {
        //Getting numbers from quote
        GetInfos();

        //Preparing data for Api call
        formData = createFormData(projectType)

        $.ajax({
            type: "POST",
            // url: 'http://localhost:3000/api/quoteCalculation/', //for local testing
            url: 'https://rocketelevators-quote.herokuapp.com/api/quoteCalculation/',
            data: JSON.stringify(formData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                setRequiredElevatorsResult(data.finalNumElev);
                if (prodRange.type != null) {
                    setPricesResults(data.finalNumElev, data.subTotal, data.installationFee, data.grandTotal);
                }
            }
        });
    }
    
    function doCalc() {
        if ($('#residential').hasClass('active') && !negativeValues() && $('#numApp').val() && $('#numFloors').val()) {
            apiCall('residential')
            console.log(residential);
        } if ($('#commercial').hasClass('active') && !negativeValues() && $('#numElev').val()) {
            apiCall('commercial')
            console.log(commercial);
        } if ($('#corporate').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#maxOcc').val()) {
            apiCall('corporate')
            console.log(corporate);
        } if ($('#hybrid').hasClass('active') && !negativeValues() && $('#numFloors').val() && $('#numBase').val() && $('#maxOcc').val()) {
            apiCall('hybrid')
            console.log(hybrid);
        
        } else {
            emptyElevatorsNumberAndPricesFields();
        
        };
    };
});
