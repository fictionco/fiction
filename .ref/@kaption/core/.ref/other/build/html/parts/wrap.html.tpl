<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="" />
  <meta name="author" content="" />
  <link rel="icon" href="https://getbootstrap.com/docs/4.0/assets/img/favicons/favicon.ico" />

  <title>Benchmark</title>
  <!-- Bootstrap core CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css" rel="stylesheet" />

  <!-- Custom styles for this template -->
  <link href="../assets/form-validation.css" rel="stylesheet" />
  <style>
    #control {
      width: 240px;
      height: 240px;
      background: #fff;
      border: 1px solid #dfe4eb;
      box-shadow: 0px 8px 16px rgba(129, 138, 153, 0.18),
        0px 0px 4px rgba(235, 239, 245, 0.6);
      border-radius: 10px;
      padding: 8px;
      position: fixed;
      right: 20px;
      top: 20px;
      z-index: 999;
    }
  </style>
  <script>
    window.__kaption = {
      ip: "{{localIp}}",
      project: {{{siteData}}}
    }
  </script>


  {{{scriptTag}}}
</head>

<body class="bg-light" data-gr-c-s-loaded="true">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="/">Tracker Test</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/page-a.html">Page</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            Dropdown
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="/page-b.html">Page B</a>
            <a class="trigger-error dropdown-item" href="">Trigger Error</a>
          </div>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>
  <div class="container">

    {{{html}}}



    <footer class="my-5 pt-5 text-muted text-center text-small">
      <p class="mb-1">© 2017-2018 Company Name</p>
      <ul class="list-inline">
        <li class="list-inline-item">
          <a href="https://getbootstrap.com/docs/4.0/examples/checkout/#">Privacy</a>
        </li>
        <li class="list-inline-item">
          <a href="https://getbootstrap.com/docs/4.0/examples/checkout/#">Terms</a>
        </li>
        <li class="list-inline-item">
          <a href="https://getbootstrap.com/docs/4.0/examples/checkout/#">Support</a>
        </li>
      </ul>
    </footer>
  </div>

  <!-- Bootstrap core JavaScript
    ================================================== -->
  <!-- Placed at the end of the document so the pages load faster -->
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.4.4/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/js/bootstrap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/holderjs@2.9.7/holder.min.js"></script>
  <script>
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
      "use strict";

      const el = document.querySelector('.trigger-error')

      if (el) {
        el.addEventListener('click', (e) => {
          e.preventDefault()
          throw new Error('Trigger Error')
        })
      }

      window.addEventListener(
        "load",
        function () {
          // Fetch all the forms we want to apply custom Bootstrap validation styles to
          var forms = document.getElementsByClassName("needs-validation");

          // Loop over them and prevent submission
          var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener(
              "submit",
              function (event) {
                if (form.checkValidity() === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
                form.classList.add("was-validated");
              },
              false,
            );
          });
        },
        false,
      );
    })();
  </script>
</body>


</html>
