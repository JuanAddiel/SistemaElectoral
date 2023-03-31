$(document).ready(function() {


    $(".delete-autor").on('click', function(e) {

        e.preventDefault();
        if (confirm("Estas seguro que deseas eliminar este autor?")) {

            $(this).closest("#form-deleteA").submit();

        }

    });
    $(".delete-categoria").on('click', function(e) {

        e.preventDefault();

        if (confirm("Estas seguro que deseas eliminar esta categoria?")) {

            $(this).closest("#form-deleteC").submit();

        }

    });

    $(".delete-editorial").on('click', function(e) {

        e.preventDefault();

        if (confirm("Estas seguro que deseas eliminar este tipo?")) {

            $(this).closest("#form-deleteE").submit();

        }

    });

    $(".delete-libro").on('click', function (e) {

        e.preventDefault();

        if (confirm("Estas seguro que deseas eliminar este libro?")) {

            $(this).closest("#form-deleteL").submit();

        }

    });
});