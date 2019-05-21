<template>
  <div class="page-elements">
    <section class="hero is-light is-medium">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <h1 class="title">Elements Preview</h1>
              <h2 class="subtitle">Bulma-ready theme.</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero has-background-white is-medium">
      <div class="container">
        <div class="columns">
          <div class="column is-2 is-relative">
            <aside class="menu section is-sticky is-sticky-top">
              <p class="menu-label">Elements</p>
              <ul class="menu-list">
                <li>
                  <a href="#typography">Typography</a>
                </li>
                <li>
                  <a href="#box">Box</a>
                </li>
                <li>
                  <a href="#button">Button</a>
                </li>
                <li>
                  <a href="#content">Content</a>
                </li>
                <li>
                  <a href="#form">Form</a>
                </li>
                <li>
                  <a href="#icon">Icon</a>
                </li>
                <li>
                  <a href="#images">Images</a>
                </li>
                <li>
                  <a href="#notifications">Notifications</a>
                </li>
                <li>
                  <a href="#progress">Progress bars</a>
                </li>
                <li>
                  <a href="#table">Table</a>
                </li>
                <li>
                  <a href="#tag">Tag</a>
                </li>
              </ul>
              <p class="menu-label">Components</p>
              <ul class="menu-list">
                <li>
                  <a href="#breadcrumb">Breadcrumb</a>
                </li>
                <li>
                  <a href="#dropdown">Dropdown</a>
                </li>
                <li>
                  <a href="#card">Card</a>
                </li>
                <li>
                  <a href="#hero">Hero</a>
                </li>
                <li>
                  <a href="#level">Level</a>
                </li>
                <li>
                  <a href="#media">Media object</a>
                </li>
                <li>
                  <a href="#menu">Menu</a>
                </li>
                <li>
                  <a href="#message">Message</a>
                </li>
                <li>
                  <a href="#modal">Modal</a>
                </li>
                <li>
                  <a href="#navbar">Navbar</a>
                </li>
                <li>
                  <a href="#pagination">Pagination</a>
                </li>
                <li>
                  <a href="#panel">Panel</a>
                </li>
                <li>
                  <a href="#tabs">Tabs</a>
                </li>
              </ul>
            </aside>
          </div>
          <div class="column">
            <section id="typography" class="section">
              <h1 class="title">Typography</h1>
              <hr>
              <div class="columns">
                <div class="column">
                  <h1 class="title is-1">Title 1</h1>
                  <h2 class="title is-2">Title 2</h2>
                  <h3 class="title is-3">Title 3</h3>
                  <h4 class="title is-4">Title 4</h4>
                  <h5 class="title is-5">Title 5</h5>
                  <h6 class="title is-6">Title 6</h6>
                </div>
                <div class="column">
                  <h1 class="subtitle is-1">Subtitle 1</h1>
                  <h2 class="subtitle is-2">Subtitle 2</h2>
                  <h3 class="subtitle is-3">Subtitle 3</h3>
                  <h4 class="subtitle is-4">Subtitle 4</h4>
                  <h5 class="subtitle is-5">Subtitle 5</h5>
                  <h6 class="subtitle is-6">Subtitle 6</h6>
                </div>
                <div class="column">
                  <h1 class="title">Title</h1>
                  <h2 class="subtitle">Subtitle</h2>
                  <p class="title is-1">Title 1</p>
                  <p class="subtitle is-3">Subtitle 3</p>
                  <p class="title is-2">Title 2</p>
                  <p class="subtitle is-4">Subtitle 4</p>
                  <p class="title is-3">Title 3</p>
                  <p class="subtitle is-5">Subtitle 5</p>
                </div>
              </div>
            </section>

            <section id="box" class="section">
              <h1 class="title">Box</h1>
              <hr>
              <div class="box">
                <article class="media">
                  <div class="media-left">
                    <figure class="image is-64x64">
                      <img
                        alt="Image"
                        src="https://s3.amazonaws.com/uifaces/faces/twitter/zeldman/128.jpg"
                      >
                    </figure>
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>John Smith</strong>
                        <small>@johnsmith</small>
                        <small>31m</small>
                        <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
                      </p>
                    </div>
                    <nav class="level">
                      <div class="level-left">
                        <a class="level-item">
                          <span class="icon is-small">
                            <i class="fa fa-reply" />
                          </span>
                        </a>
                        <a class="level-item">
                          <span class="icon is-small">
                            <i class="fa fa-retweet" />
                          </span>
                        </a>
                        <a class="level-item">
                          <span class="icon is-small">
                            <i class="fa fa-heart" />
                          </span>
                        </a>
                      </div>
                    </nav>
                  </div>
                </article>
              </div>
            </section>

            <section id="button" class="section">
              <h1 class="title">Button</h1>
              <hr>
              <div class="columns">
                <div class="column">
                  <div class="buttons">
                    <a class="button">Button</a>
                    <a class="button is-white">White</a>
                    <a class="button is-light">Light</a>
                    <a class="button is-dark">Dark</a>
                    <a class="button is-black">Black</a>
                    <a class="button is-link">Link</a>
                    <a class="button is-text">Link</a>
                  </div>
                  <div class="buttons">
                    <a class="button is-primary">Primary</a>
                    <a class="button is-info">Info</a>
                    <a class="button is-success">Success</a>
                    <a class="button is-warning">Warning</a>
                    <a class="button is-danger">Danger</a>
                  </div>
                  <div class="buttons">
                    <a class="button is-focused">Focus</a>
                    <a class="button is-primary is-focused">Focus</a>
                    <a class="button is-info is-focused">Focus</a>
                    <a class="button is-success is-focused">Focus</a>
                    <a class="button is-warning is-focused">Focus</a>
                    <a class="button is-danger is-focused">Focus</a>
                  </div>
                  <div class="buttons">
                    <a class="button is-hovered">Hover</a>
                    <a class="button is-primary is-hovered">Hover</a>
                    <a class="button is-info is-hovered">Hover</a>
                    <a class="button is-success is-hovered">Hover</a>
                    <a class="button is-warning is-hovered">Hover</a>
                    <a class="button is-danger is-hovered">Hover</a>
                  </div>
                  <div class="buttons">
                    <a class="button is-active">Active</a>
                    <a class="button is-primary is-active">Active</a>
                    <a class="button is-info is-active">Active</a>
                    <a class="button is-success is-active">Active</a>
                    <a class="button is-warning is-active">Active</a>
                    <a class="button is-danger is-active">Active</a>
                  </div>
                  <div class="buttons">
                    <a class="button is-loading">Loading</a>
                    <a class="button is-primary is-loading">Loading</a>
                    <a class="button is-info is-loading">Loading</a>
                    <a class="button is-success is-loading">Loading</a>
                    <a class="button is-warning is-loading">Loading</a>
                    <a class="button is-danger is-loading">Loading</a>
                  </div>
                  <p class="field">
                    <a class="button">
                      <span class="icon is-small">
                        <i class="fa fa-bold" />
                      </span>
                    </a>
                    <a class="button">
                      <span class="icon is-small">
                        <i class="fa fa-italic" />
                      </span>
                    </a>
                    <a class="button">
                      <span class="icon is-small">
                        <i class="fa fa-underline" />
                      </span>
                    </a>
                    <a class="button">
                      <span class="icon">
                        <i class="fa fa-github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                    <a class="button is-primary">
                      <span class="icon">
                        <i class="fa fa-twitter" />
                      </span>
                      <span>Twitter</span>
                    </a>
                    <a class="button is-success">
                      <span class="icon is-small">
                        <i class="fa fa-check" />
                      </span>
                      <span>Save</span>
                    </a>
                    <a class="button is-danger is-outlined">
                      <span>Delete</span>
                      <span class="icon is-small">
                        <i class="fa fa-times" />
                      </span>
                    </a>
                  </p>
                  <div class="field has-addons">
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <i class="fa fa-bold" />
                        </span>
                        <span>Bold</span>
                      </a>
                    </p>
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <i class="fa fa-italic" />
                        </span>
                        <span>Italic</span>
                      </a>
                    </p>
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <i class="fa fa-underline" />
                        </span>
                        <span>Underline</span>
                      </a>
                    </p>
                  </div>

                  <div class="field has-addons">
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <i class="fa fa-align-left" />
                        </span>
                        <span>Left</span>
                      </a>
                    </p>
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <i class="fa fa-align-center" />
                        </span>
                        <span>Center</span>
                      </a>
                    </p>
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <i class="fa fa-align-right" />
                        </span>
                        <span>Right</span>
                      </a>
                    </p>
                  </div>
                  <div class="buttons">
                    <a class="button is-rounded">Rounded</a>
                    <a class="button is-primary is-rounded">Rounded</a>
                    <a class="button is-link is-rounded">Rounded</a>
                    <a class="button is-info is-rounded">Rounded</a>
                    <a class="button is-success is-rounded">Rounded</a>
                    <a class="button is-danger is-rounded">Rounded</a>
                  </div>
                </div>
                <div class="column">
                  <div class="buttons">
                    <a class="button is-small">Small</a>
                    <a class="button">Normal</a>
                    <a class="button is-medium">Medium</a>
                    <a class="button is-large">Large</a>
                  </div>
                  <div class="buttons">
                    <a class="button is-outlined">Outlined</a>
                    <a class="button is-primary is-outlined">Outlined</a>
                    <a class="button is-info is-outlined">Outlined</a>
                    <a class="button is-success is-outlined">Outlined</a>
                    <a class="button is-danger is-outlined">Outlined</a>
                  </div>
                  <div class="buttons notification is-primary">
                    <a class="button is-primary is-inverted is-outlined">Invert Outlined</a>
                    <a class="button is-info is-inverted is-outlined">Invert Outlined</a>
                    <a class="button is-success is-inverted is-outlined">Invert Outlined</a>
                    <a class="button is-danger is-inverted is-outlined">Invert Outlined</a>
                  </div>
                  <div class="buttons notification is-primary">
                    <a class="button is-primary is-inverted">Inverted</a>
                    <a class="button is-info is-inverted">Inverted</a>
                    <a class="button is-success is-inverted">Inverted</a>
                    <a class="button is-danger is-inverted">Inverted</a>
                  </div>
                  <p class="buttons">
                    <a class="button is-small">
                      <span class="icon is-small">
                        <i class="fa fa-github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                    <a class="button">
                      <span class="icon">
                        <i class="fa fa-github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                    <a class="button is-medium">
                      <span class="icon">
                        <i class="fa fa-github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                    <a class="button is-large">
                      <span class="icon is-medium">
                        <i class="fa fa-github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                  </p>
                  <p class="field">
                    <a class="button is-small">
                      <span class="icon is-small">
                        <i class="fa fa-header" />
                      </span>
                    </a>
                  </p>
                  <p class="field">
                    <a class="button">
                      <span class="icon is-small">
                        <i class="fa fa-header" />
                      </span>
                    </a>
                    <a class="button">
                      <span class="icon">
                        <i class="fa fa-header fa-lg" />
                      </span>
                    </a>
                  </p>
                  <p class="field">
                    <a class="button is-medium">
                      <span class="icon is-small">
                        <i class="fa fa-header" />
                      </span>
                    </a>
                    <a class="button is-medium">
                      <span class="icon">
                        <i class="fa fa-header fa-lg" />
                      </span>
                    </a>
                    <a class="button is-medium">
                      <span class="icon is-medium">
                        <i class="fa fa-header fa-2x" />
                      </span>
                    </a>
                  </p>
                  <p class="field">
                    <a class="button is-large">
                      <span class="icon is-small">
                        <i class="fa fa-header" />
                      </span>
                    </a>
                    <a class="button is-large">
                      <span class="icon is-medium">
                        <i class="fa fa-header fa-lg" />
                      </span>
                    </a>
                    <a class="button is-large">
                      <span class="icon is-large">
                        <i class="fa fa-header fa-2x" />
                      </span>
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section id="content" class="section">
              <h1 class="title">Content</h1>
              <hr>
              <div class="content">
                <h1>Hello World</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus. Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.</p>
                <h2>Second level</h2>
                <p>
                  Curabitur accumsan turpis pharetra
                  <strong>augue tincidunt</strong> blandit. Quisque condimentum maximus mi, sit amet commodo arcu rutrum id. Proin pretium urna vel cursus venenatis. Suspendisse potenti. Etiam mattis sem rhoncus lacus dapibus facilisis. Donec at dignissim dui. Ut et neque nisl.
                </p>
                <ul>
                  <li>In fermentum leo eu lectus mollis, quis dictum mi aliquet.</li>
                  <li>Morbi eu nulla lobortis, lobortis est in, fringilla felis.</li>
                  <li>Aliquam nec felis in sapien venenatis viverra fermentum nec lectus.</li>
                  <li>Ut non enim metus.</li>
                </ul>
                <h3>Third level</h3>
                <p>
                  Quisque ante lacus, malesuada ac auctor vitae, congue
                  <a href="#">non ante</a>. Phasellus lacus ex, semper ac tortor nec, fringilla condimentum orci. Fusce eu rutrum tellus.
                </p>
                <ol>
                  <li>Donec blandit a lorem id convallis.</li>
                  <li>Cras gravida arcu at diam gravida gravida.</li>
                  <li>Integer in volutpat libero.</li>
                  <li>Donec a diam tellus.</li>
                  <li>Aenean nec tortor orci.</li>
                  <li>Quisque aliquam cursus urna, non bibendum massa viverra eget.</li>
                  <li>Vivamus maximus ultricies pulvinar.</li>
                </ol>
                <blockquote>Ut venenatis, nisl scelerisque sollicitudin fermentum, quam libero hendrerit ipsum, ut blandit est tellus sit amet turpis.</blockquote>
                <p>
                  Quisque at semper enim, eu hendrerit odio. Etiam auctor nisl et
                  <em>justo sodales</em> elementum. Maecenas ultrices lacus quis neque consectetur, et lobortis nisi molestie.
                </p>
                <p>Sed sagittis enim ac tortor maximus rutrum. Nulla facilisi. Donec mattis vulputate risus in luctus. Maecenas vestibulum interdum commodo.</p>
                <p>Suspendisse egestas sapien non felis placerat elementum. Morbi tortor nisl, suscipit sed mi sit amet, mollis malesuada nulla. Nulla facilisi. Nullam ac erat ante.</p>
                <h4>Fourth level</h4>
                <p>Nulla efficitur eleifend nisi, sit amet bibendum sapien fringilla ac. Mauris euismod metus a tellus laoreet, at elementum ex efficitur.</p>
                <p>Maecenas eleifend sollicitudin dui faucibus sollicitudin augue cursus non. Ut finibus eleifend arcu ut vehicula. Mauris eu est maximus est porta condimentum in eu justo. Nulla id iaculis sapien.</p>
                <table>
                  <thead>
                    <tr>
                      <th>One</th>
                      <th>Two</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Three</td>
                      <td>Four</td>
                    </tr>
                    <tr>
                      <td>Five</td>
                      <td>Six</td>
                    </tr>
                    <tr>
                      <td>Seven</td>
                      <td>Eight</td>
                    </tr>
                    <tr>
                      <td>Nine</td>
                      <td>Ten</td>
                    </tr>
                    <tr>
                      <td>Eleven</td>
                      <td>Twelve</td>
                    </tr>
                  </tbody>
                </table>
                <p>Phasellus porttitor enim id metus volutpat ultricies. Ut nisi nunc, blandit sed dapibus at, vestibulum in felis. Etiam iaculis lorem ac nibh bibendum rhoncus. Nam interdum efficitur ligula sit amet ullamcorper. Etiam tristique, leo vitae porta faucibus, mi lacus laoreet metus, at cursus leo est vel tellus. Sed ac posuere est. Nunc ultricies nunc neque, vitae ultricies ex sodales quis. Aliquam eu nibh in libero accumsan pulvinar. Nullam nec nisl placerat, pretium metus vel, euismod ipsum. Proin tempor cursus nisl vel condimentum. Nam pharetra varius metus non pellentesque.</p>
                <h5>Fifth level</h5>
                <p>Aliquam sagittis rhoncus vulputate. Cras non luctus sem, sed tincidunt ligula. Vestibulum at nunc elit. Praesent aliquet ligula mi, in luctus elit volutpat porta. Phasellus molestie diam vel nisi sodales, a eleifend augue laoreet. Sed nec eleifend justo. Nam et sollicitudin odio.</p>
                <h6>Sixth level</h6>
                <p>Cras in nibh lacinia, venenatis nisi et, auctor urna. Donec pulvinar lacus sed diam dignissim, ut eleifend eros accumsan. Phasellus non tortor eros. Ut sed rutrum lacus. Etiam purus nunc, scelerisque quis enim vitae, malesuada ultrices turpis. Nunc vitae maximus purus, nec consectetur dui. Suspendisse euismod, elit vel rutrum commodo, ipsum tortor maximus dui, sed varius sapien odio vitae est. Etiam at cursus metus.</p>
              </div>
            </section>

            <section id="form" class="section">
              <h1 class="title">Form</h1>
              <hr>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Name</label>
                    <p class="control">
                      <input class="input" type="text" placeholder="Text input">
                    </p>
                  </div>
                  <div class="field">
                    <label class="label">Username</label>
                    <p class="control has-icons-left has-icons-right">
                      <input
                        class="input is-success"
                        type="text"
                        placeholder="Text input"
                        value="bulma"
                      >
                      <span class="icon is-small is-left">
                        <i class="fa fa-user" />
                      </span>
                      <span class="icon is-small is-right">
                        <i class="fa fa-check" />
                      </span>
                    </p>
                    <p class="help is-success">This username is available</p>
                  </div>
                  <div class="field">
                    <label class="label">Email</label>
                    <p class="control has-icons-left has-icons-right">
                      <input
                        class="input is-danger"
                        type="text"
                        placeholder="Email input"
                        value="hello@"
                      >
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope" />
                      </span>
                      <span class="icon is-small is-right">
                        <i class="fa fa-warning" />
                      </span>
                    </p>
                    <p class="help is-danger">This email is invalid</p>
                  </div>
                  <div class="field">
                    <label class="label">Subject</label>
                    <p class="control">
                      <span class="select is-fullwidth">
                        <select>
                          <option>Select dropdown</option>
                          <option>With options</option>
                        </select>
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <label class="label">Message</label>
                    <p class="control">
                      <textarea class="textarea" placeholder="Textarea" />
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <label class="checkbox">
                        <input type="checkbox"> I agree to the
                        <a href="#">terms and conditions</a>
                      </label>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <label class="radio">
                        <input type="radio" name="question"> Yes
                      </label>
                      <label class="radio">
                        <input type="radio" name="question"> No
                      </label>
                    </p>
                  </div>
                  <div class="field is-grouped">
                    <p class="control">
                      <button class="button is-primary">Submit</button>
                    </p>
                    <p class="control">
                      <button class="button is-link">Cancel</button>
                    </p>
                  </div>
                  <br>
                  <h4 class="subtitle">Disabled</h4>
                  <hr>
                  <div class="field">
                    <p class="control">
                      <input class="input" disabled placeholder="Disabled input" type="text">
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <textarea class="textarea" disabled placeholder="Disabled textarea" />
                    </p>
                  </div>
                  <br>
                  <h3 class="title">File</h3>
                  <hr>
                  <div class="field">
                    <div class="file">
                      <label class="file-label">
                        <input class="file-input" type="file" name="resume">
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fa fa-upload" />
                          </span>
                          <span class="file-label">Choose a file…</span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div class="field">
                    <div class="file has-name">
                      <label class="file-label">
                        <input class="file-input" type="file" name="resume">
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fa fa-upload" />
                          </span>
                          <span class="file-label">Choose a file…</span>
                        </span>
                        <span class="file-name">Screen Shot 2019-12-31 at 11.59.35.png</span>
                      </label>
                    </div>
                  </div>
                  <div class="field">
                    <div class="file is-primary">
                      <label class="file-label">
                        <input class="file-input" type="file" name="resume">
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fa fa-upload" />
                          </span>
                          <span class="file-label">Primary file…</span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div class="field">
                    <div class="file is-info has-name">
                      <label class="file-label">
                        <input class="file-input" type="file" name="resume">
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fa fa-upload" />
                          </span>
                          <span class="file-label">Info file…</span>
                        </span>
                        <span class="file-name">Screen Shot 2019-12-31 at 11.59.35.png</span>
                      </label>
                    </div>
                  </div>
                  <div class="field">
                    <div class="file is-warning is-boxed">
                      <label class="file-label">
                        <input class="file-input" type="file" name="resume">
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fa fa-cloud-upload" />
                          </span>
                          <span class="file-label">Warning file…</span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div class="field">
                    <div class="file is-danger has-name is-boxed">
                      <label class="file-label">
                        <input class="file-input" type="file" name="resume">
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fa fa-cloud-upload" />
                          </span>
                          <span class="file-label">Danger file…</span>
                        </span>
                        <span class="file-name">Screen Shot 2019-12-31 at 11.59.35.png</span>
                      </label>
                    </div>
                  </div>
                  <br>
                  <h3 class="title">Form addons</h3>
                  <hr>
                  <div class="field has-addons">
                    <p class="control">
                      <input class="input" type="text" placeholder="Find a repository">
                    </p>
                    <p class="control">
                      <a class="button is-info">Search</a>
                    </p>
                  </div>
                  <div class="field has-addons">
                    <p class="control">
                      <input class="input is-large" type="text" placeholder="Find a repository">
                    </p>
                    <p class="control">
                      <a class="button is-info is-large">Search</a>
                    </p>
                  </div>
                  <div class="field has-addons">
                    <p class="control">
                      <span class="select">
                        <select>
                          <option>$</option>
                          <option>£</option>
                          <option>€</option>
                        </select>
                      </span>
                    </p>
                    <p class="control">
                      <input class="input" type="text" placeholder="Amount of money">
                    </p>
                    <p class="control">
                      <a class="button">Transfer</a>
                    </p>
                  </div>
                  <div class="field has-addons">
                    <p class="control">
                      <span class="select">
                        <select>
                          <option>$</option>
                          <option>£</option>
                          <option>€</option>
                        </select>
                      </span>
                    </p>
                    <p class="control is-expanded">
                      <input class="input" type="text" placeholder="Amount of money">
                    </p>
                    <p class="control">
                      <a class="button">Transfer</a>
                    </p>
                  </div>
                  <div class="field has-addons">
                    <p class="control is-expanded">
                      <span class="select is-fullwidth">
                        <select name="country">
                          <option value="Argentina">Argentina</option>
                          <option value="Bolivia">Bolivia</option>
                          <option value="Brazil">Brazil</option>
                          <option value="Chile">Chile</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Ecuador">Ecuador</option>
                          <option value="Guyana">Guyana</option>
                          <option value="Paraguay">Paraguay</option>
                          <option value="Peru">Peru</option>
                          <option value="Suriname">Suriname</option>
                          <option value="Uruguay">Uruguay</option>
                          <option value="Venezuela">Venezuela</option>
                        </select>
                      </span>
                    </p>
                    <p class="control">
                      <button type="submit" class="button is-primary">Choose</button>
                    </p>
                  </div>
                  <div class="field is-grouped">
                    <p class="control is-expanded">
                      <input class="input" type="text" placeholder="Find a repository">
                    </p>
                    <p class="control">
                      <a class="button is-info">Search</a>
                    </p>
                  </div>
                </div>
                <div class="column">
                  <br>
                  <h3 class="subtitle">Styles</h3>
                  <hr>
                  <div class="field">
                    <p class="control">
                      <input class="input is-rounded" type="text" placeholder="Rounded input">
                    </p>
                  </div>
                  <br>
                  <h3 class="subtitle">Colors</h3>
                  <hr>
                  <div class="field">
                    <p class="control">
                      <input class="input is-primary" type="text" placeholder="Primary input">
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <input class="input is-info" type="text" placeholder="Info input">
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <input class="input is-success" type="text" placeholder="Success input">
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <input class="input is-warning" type="text" placeholder="Warning input">
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <input class="input is-danger" type="text" placeholder="Danger input">
                    </p>
                  </div>
                  <br>
                  <h3 class="subtitle">Sizes</h3>
                  <hr>
                  <div class="field">
                    <label class="label is-small">Small</label>
                    <p class="control">
                      <input class="input is-small" type="text" placeholder="Small input">
                    </p>
                  </div>
                  <div class="field">
                    <label class="label">Normal</label>
                    <p class="control">
                      <input class="input" type="text" placeholder="Normal input">
                    </p>
                  </div>
                  <div class="field">
                    <label class="label is-medium">Medium</label>
                    <p class="control">
                      <input class="input is-medium" type="text" placeholder="Medium input">
                    </p>
                  </div>
                  <div class="field">
                    <label class="label is-large">Large</label>
                    <p class="control">
                      <input class="input is-large" type="text" placeholder="Large input">
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <span class="select is-small">
                        <select>
                          <option>Select dropdown</option>
                          <option>With options</option>
                        </select>
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <span class="select">
                        <select>
                          <option>Select dropdown</option>
                          <option>With options</option>
                        </select>
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <span class="select is-medium">
                        <select>
                          <option>Select dropdown</option>
                          <option>With options</option>
                        </select>
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <span class="select is-large">
                        <select>
                          <option>Select dropdown</option>
                          <option>With options</option>
                        </select>
                      </span>
                    </p>
                  </div>

                  <br>
                  <h4 class="subtitle">With icons</h4>
                  <hr>
                  <div class="field">
                    <p class="control has-icons-left">
                      <input class="input" type="email" placeholder="Email">
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope" />
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control has-icons-left">
                      <input class="input" type="password" placeholder="Password">
                      <span class="icon is-small is-left">
                        <i class="fa fa-lock" />
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button class="button is-success">Login</button>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="icon" class="section">
              <h1 class="title">Icon</h1>
              <hr>
              <span class="icon">
                <factor-icon icon="home" />
              </span>
              <br>
              <br>
              <h4 class="subtitle">Colors</h4>
              <hr>
              <span class="icon has-text-info">
                <factor-icon icon="info-circle" />
              </span>
              <span class="icon has-text-success">
                <factor-icon icon="check-square" />
              </span>
              <span class="icon has-text-warning">
                <factor-icon icon="exclamation-triangle" />
              </span>
              <span class="icon has-text-danger">
                <factor-icon icon="ban" />
              </span>
              <br>
              <br>
              <h4 class="subtitle">Sizes</h4>
              <hr>
              <span class="icon is-small has-text-info">
                <factor-icon icon="info-circle" />
              </span>
              <span class="icon has-text-success">
                <factor-icon icon="check-square" class="fa-lg" />
              </span>
              <span class="icon is-medium has-text-warning">
                <factor-icon icon="exclamation-triangle" class="fa-2x" />
              </span>
              <span class="icon is-large has-text-danger">
                <factor-icon icon="ban" class="fa-3x" />
              </span>
            </section>

            <section id="images" class="section">
              <h1 class="title">Images</h1>
              <hr>
              <figure class="image is-128x128">
                <img src="https://s3.amazonaws.com/uifaces/faces/twitter/zeldman/128.jpg">
              </figure>
            </section>

            <section id="notifications" class="section">
              <h1 class="title">Notifications</h1>
              <hr>
              <div class="columns is-multiline">
                <div class="column is-half">
                  <div class="notification">
                    <button class="delete" /> Lorem ipsum dolor sit amet,
                    <a href="#">consectetur</a> adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>

                <div class="column is-half">
                  <div class="notification is-primary">
                    <button class="delete" /> Lorem ipsum dolor sit amet,
                    <a href="#">consectetur</a> adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>

                <div class="column is-half">
                  <div class="notification is-info">
                    <button class="delete" /> Lorem ipsum dolor sit amet,
                    <a href="#">consectetur</a> adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>

                <div class="column is-half">
                  <div class="notification is-success">
                    <button class="delete" /> Lorem ipsum dolor sit amet,
                    <a href="#">consectetur</a> adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>

                <div class="column is-half">
                  <div class="notification is-warning">
                    <button class="delete" /> Lorem ipsum dolor sit amet,
                    <a href="#">consectetur</a> adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>

                <div class="column is-half">
                  <div class="notification is-danger">
                    <button class="delete" /> Lorem ipsum dolor sit amet,
                    <a href="#">consectetur</a> adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </div>
              </div>
            </section>

            <section id="progress" class="section">
              <h1 class="title">Progress bars</h1>
              <hr>

              <progress class="progress" max="100" value="15">15%</progress>

              <progress class="progress is-primary" max="100" value="15">15%</progress>

              <progress class="progress is-link" max="100" value="15">15%</progress>

              <progress class="progress is-info" max="100" value="15">15%</progress>

              <progress class="progress is-success" max="100" value="15">15%</progress>

              <progress class="progress is-warning" max="100" value="15">15%</progress>

              <progress class="progress is-danger" max="100" value="15">15%</progress>

              <progress class="progress is-small" max="100" value="15">15%</progress>
              <progress class="progress" max="100" value="30">30%</progress>
              <progress class="progress is-medium" max="100" value="45">45%</progress>
              <progress class="progress is-large" max="100" value="60">60%</progress>
            </section>

            <section id="table" class="section">
              <h1 class="title">Table</h1>
              <hr>
              <h2 class="subtitle">Default</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>
                      <abbr title="Position">Pos</abbr>
                    </th>
                    <th>Team</th>
                    <th>
                      <abbr title="Played">Pld</abbr>
                    </th>
                    <th>
                      <abbr title="Won">W</abbr>
                    </th>
                    <th>
                      <abbr title="Drawn">D</abbr>
                    </th>
                    <th>
                      <abbr title="Lost">L</abbr>
                    </th>
                    <th>
                      <abbr title="Goals for">GF</abbr>
                    </th>
                    <th>
                      <abbr title="Goals against">GA</abbr>
                    </th>
                    <th>
                      <abbr title="Goal difference">GD</abbr>
                    </th>
                    <th>
                      <abbr title="Points">Pts</abbr>
                    </th>
                    <th>Qualification or relegation</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>
                      <abbr title="Position">Pos</abbr>
                    </th>
                    <th>Team</th>
                    <th>
                      <abbr title="Played">Pld</abbr>
                    </th>
                    <th>
                      <abbr title="Won">W</abbr>
                    </th>
                    <th>
                      <abbr title="Drawn">D</abbr>
                    </th>
                    <th>
                      <abbr title="Lost">L</abbr>
                    </th>
                    <th>
                      <abbr title="Goals for">GF</abbr>
                    </th>
                    <th>
                      <abbr title="Goals against">GA</abbr>
                    </th>
                    <th>
                      <abbr title="Goal difference">GD</abbr>
                    </th>
                    <th>
                      <abbr title="Points">Pts</abbr>
                    </th>
                    <th>Qualification or relegation</th>
                  </tr>
                </tfoot>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>
                      <a
                        href="https://en.wikipedia.org/wiki/Leicester_City_F.C."
                        title="Leicester City F.C."
                      >Leicester City</a>
                      <strong>(C)</strong>
                    </td>
                    <td>38</td>
                    <td>23</td>
                    <td>12</td>
                    <td>3</td>
                    <td>68</td>
                    <td>36</td>
                    <td>+32</td>
                    <td>81</td>
                    <td>
                      Qualification for the
                      <a
                        href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage"
                        title="2016–17 UEFA Champions League"
                      >Champions League group stage</a>
                    </td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>
                      <a
                        href="https://en.wikipedia.org/wiki/Arsenal_F.C."
                        title="Arsenal F.C."
                      >Arsenal</a>
                    </td>
                    <td>38</td>
                    <td>20</td>
                    <td>11</td>
                    <td>7</td>
                    <td>65</td>
                    <td>36</td>
                    <td>+29</td>
                    <td>71</td>
                    <td>
                      Qualification for the
                      <a
                        href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage"
                        title="2016–17 UEFA Champions League"
                      >Champions League group stage</a>
                    </td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>
                      <a
                        href="https://en.wikipedia.org/wiki/Tottenham_Hotspur_F.C."
                        title="Tottenham Hotspur F.C."
                      >Tottenham Hotspur</a>
                    </td>
                    <td>38</td>
                    <td>19</td>
                    <td>13</td>
                    <td>6</td>
                    <td>69</td>
                    <td>35</td>
                    <td>+34</td>
                    <td>70</td>
                    <td>
                      Qualification for the
                      <a
                        href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage"
                        title="2016–17 UEFA Champions League"
                      >Champions League group stage</a>
                    </td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>
                      <a
                        href="https://en.wikipedia.org/wiki/Manchester_City_F.C."
                        title="Manchester City F.C."
                      >Manchester City</a>
                    </td>
                    <td>38</td>
                    <td>19</td>
                    <td>9</td>
                    <td>10</td>
                    <td>71</td>
                    <td>41</td>
                    <td>+30</td>
                    <td>66</td>
                    <td>
                      Qualification for the
                      <a
                        href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Play-off_round"
                        title="2016–17 UEFA Champions League"
                      >Champions League play-off round</a>
                    </td>
                  </tr>
                  <tr class="is-selected">
                    <th>5</th>
                    <td>
                      <a
                        href="https://en.wikipedia.org/wiki/Manchester_United_F.C."
                        title="Manchester United F.C."
                      >Manchester United</a>
                    </td>
                    <td>38</td>
                    <td>19</td>
                    <td>9</td>
                    <td>10</td>
                    <td>49</td>
                    <td>35</td>
                    <td>+14</td>
                    <td>66</td>
                    <td>
                      Qualification for the
                      <a
                        href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Europa_League#Group_stage"
                        title="2016–17 UEFA Europa League"
                      >Europa League group stage</a>
                    </td>
                  </tr>
                  <tr>
                    <th>6</th>
                    <td>
                      <a
                        href="https://en.wikipedia.org/wiki/Southampton_F.C."
                        title="Southampton F.C."
                      >Southampton</a>
                    </td>
                    <td>38</td>
                    <td>18</td>
                    <td>9</td>
                    <td>11</td>
                    <td>59</td>
                    <td>41</td>
                    <td>+18</td>
                    <td>63</td>
                    <td>
                      Qualification for the
                      <a
                        href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Europa_League#Group_stage"
                        title="2016–17 UEFA Europa League"
                      >Europa League group stage</a>
                    </td>
                  </tr>
                  <tr>
                    <th>7</th>
                    <td>
                      <a
                        href="https://en.wikipedia.org/wiki/West_Ham_United_F.C."
                        title="West Ham United F.C."
                      >West Ham United</a>
                    </td>
                    <td>38</td>
                    <td>16</td>
                    <td>14</td>
                    <td>8</td>
                    <td>65</td>
                    <td>51</td>
                    <td>+14</td>
                    <td>62</td>
                    <td>
                      Qualification for the
                      <a
                        href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Europa_League#Third_qualifying_round"
                        title="2016–17 UEFA Europa League"
                      >Europa League third qualifying round</a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br>
              <br>
              <h2 class="subtitle">Striped</h2>
              <hr>
              <table class="table is-striped">
                <thead>
                  <tr>
                    <th>One</th>
                    <th>Two</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Three</td>
                    <td>Four</td>
                  </tr>
                  <tr>
                    <td>Five</td>
                    <td>Six</td>
                  </tr>
                  <tr>
                    <td>Seven</td>
                    <td>Eight</td>
                  </tr>
                  <tr>
                    <td>Nine</td>
                    <td>Ten</td>
                  </tr>
                  <tr>
                    <td>Eleven</td>
                    <td>Twelve</td>
                  </tr>
                </tbody>
              </table>
              <br>
              <br>
              <h2 class="subtitle">Bordered</h2>
              <hr>
              <table class="table is-bordered">
                <thead>
                  <tr>
                    <th>One</th>
                    <th>Two</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Three</td>
                    <td>Four</td>
                  </tr>
                </tbody>
              </table>
              <br>
              <br>
              <h2 class="subtitle">Narrow</h2>
              <hr>
              <table class="table is-narrow">
                <thead>
                  <tr>
                    <th>One</th>
                    <th>Two</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Three</td>
                    <td>Four</td>
                  </tr>
                  <tr>
                    <td>Five</td>
                    <td>Six</td>
                  </tr>
                  <tr>
                    <td>Seven</td>
                    <td>Eight</td>
                  </tr>
                  <tr>
                    <td>Nine</td>
                    <td>Ten</td>
                  </tr>
                  <tr>
                    <td>Eleven</td>
                    <td>Twelve</td>
                  </tr>
                </tbody>
              </table>
              <br>
              <br>
              <h2 class="subtitle">Bordered, Striped, and Narrow</h2>
              <hr>
              <table class="table is-bordered is-striped is-narrow">
                <thead>
                  <tr>
                    <th>One</th>
                    <th>Two</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Three</td>
                    <td>Four</td>
                  </tr>
                  <tr>
                    <td>Five</td>
                    <td>Six</td>
                  </tr>
                  <tr>
                    <td>Seven</td>
                    <td>Eight</td>
                  </tr>
                  <tr>
                    <td>Nine</td>
                    <td>Ten</td>
                  </tr>
                  <tr>
                    <td>Eleven</td>
                    <td>Twelve</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section id="tag" class="section">
              <h1 class="title">Tag</h1>
              <hr>
              <div class="tags">
                <span class="tag is-primary">Primary</span>

                <span class="tag is-link">Link</span>

                <span class="tag is-info">Info</span>

                <span class="tag is-success">Success</span>

                <span class="tag is-warning">Warning</span>

                <span class="tag is-danger">Danger</span>

                <span class="tag is-white">White</span>

                <span class="tag is-black">Black</span>

                <span class="tag is-light">Light</span>

                <span class="tag is-dark">Dark</span>

                <span class="tag is-primary is-medium">Medium</span>
                <span class="tag is-info is-large">Large</span>
                <span class="tag is-success">
                  Bar
                  <button class="delete is-small" />
                </span>
                <span class="tag is-warning is-medium">
                  Hello
                  <button class="delete is-small" />
                </span>
                <span class="tag is-danger is-large">
                  World
                  <button class="delete" />
                </span>
              </div>
              <div class="field is-grouped is-grouped-multiline">
                <div class="control">
                  <div class="tags has-addons">
                    <span class="tag is-dark">npm</span>
                    <span class="tag is-info">0.5.0</span>
                  </div>
                </div>

                <div class="control">
                  <div class="tags has-addons">
                    <span class="tag is-dark">build</span>
                    <span class="tag is-success">passing</span>
                  </div>
                </div>

                <div class="control">
                  <div class="tags has-addons">
                    <span class="tag is-dark">chat</span>
                    <span class="tag is-primary">on gitter</span>
                  </div>
                </div>
              </div>
              <div class="field is-grouped is-grouped-multiline">
                <div class="control">
                  <div class="tags has-addons">
                    <a class="tag is-link">Technology</a>
                    <a class="tag is-delete" />
                  </div>
                </div>

                <div class="control">
                  <div class="tags has-addons">
                    <a class="tag is-link">CSS</a>
                    <a class="tag is-delete" />
                  </div>
                </div>

                <div class="control">
                  <div class="tags has-addons">
                    <a class="tag is-link">Flexbox</a>
                    <a class="tag is-delete" />
                  </div>
                </div>

                <div class="control">
                  <div class="tags has-addons">
                    <a class="tag is-link">Web Design</a>
                    <a class="tag is-delete" />
                  </div>
                </div>

                <div class="control">
                  <div class="tags has-addons">
                    <a class="tag is-link">Open Source</a>
                    <a class="tag is-delete" />
                  </div>
                </div>

                <div class="control">
                  <div class="tags has-addons">
                    <a class="tag is-link">Community</a>
                    <a class="tag is-delete" />
                  </div>
                </div>

                <div class="control">
                  <div class="tags has-addons">
                    <a class="tag is-link">Documentation</a>
                    <a class="tag is-delete" />
                  </div>
                </div>
              </div>
            </section>

            <section id="more" class="section">
              Even more elements like a versatile delete section, icon containers, etc. Details on the
              <app-link
                class="is-link"
                path="https://bulma.io/documentation"
                target="_blank"
              >Bulma website</app-link>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: true
    }
  },
  mounted() {},
  metatags() {
    return {
      title: "Bulma Elements",
      description:
        "Bulma is a free, open source CSS framework based on Flexbox and used by more than 150,000 developers.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.page-elements {
  // .columns {
  //   background: rgb(186, 250, 255);
  // }
}
</style>