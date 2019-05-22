<template>
  <div class="page-elements">
    <section class="hero is-light is-medium">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <h1 class="title is-1">Interface Elements Preview</h1>
              <h2 class="subtitle">Bulma-ready theme.</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="has-background-white is-medium">
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
          <div class="column is-10">
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
                      <img src="https://source.unsplash.com/random/128x128" alt="Image">
                    </figure>
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>Raymond Aleman</strong>
                        <small>@raymondaleman</small>
                        <small>31m</small>
                        <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
                      </p>
                    </div>
                    <nav class="level">
                      <div class="level-left">
                        <a class="level-item">
                          <span class="icon is-small">
                            <factor-icon icon="reply" />
                          </span>
                        </a>
                        <a class="level-item">
                          <span class="icon is-small">
                            <factor-icon icon="retweet" />
                          </span>
                        </a>
                        <a class="level-item">
                          <span class="icon is-small">
                            <factor-icon icon="heart" />
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
                        <factor-icon icon="bold" />
                      </span>
                    </a>
                    <a class="button">
                      <span class="icon is-small">
                        <factor-icon icon="italic" />
                      </span>
                    </a>
                    <a class="button">
                      <span class="icon is-small">
                        <factor-icon icon="underline" />
                      </span>
                    </a>
                    <a class="button">
                      <span class="icon">
                        <factor-icon icon="github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                    <a class="button is-primary">
                      <span class="icon">
                        <factor-icon icon="twitter" />
                      </span>
                      <span>Twitter</span>
                    </a>
                    <a class="button is-success">
                      <span class="icon is-small">
                        <factor-icon icon="check" />
                      </span>
                      <span>Save</span>
                    </a>
                    <a class="button is-danger is-outlined">
                      <span>Delete</span>
                      <span class="icon is-small">
                        <factor-icon icon="times" />
                      </span>
                    </a>
                  </p>
                  <div class="field has-addons">
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <factor-icon icon="bold" />
                        </span>
                        <span>Bold</span>
                      </a>
                    </p>
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <factor-icon icon="italic" />
                        </span>
                        <span>Italic</span>
                      </a>
                    </p>
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <factor-icon icon="underline" />
                        </span>
                        <span>Underline</span>
                      </a>
                    </p>
                  </div>

                  <div class="field has-addons">
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <factor-icon icon="align-left" />
                        </span>
                        <span>Left</span>
                      </a>
                    </p>
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <factor-icon icon="align-center" />
                        </span>
                        <span>Center</span>
                      </a>
                    </p>
                    <p class="control">
                      <a class="button">
                        <span class="icon is-small">
                          <factor-icon icon="align-right" />
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
                        <factor-icon icon="github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                    <a class="button">
                      <span class="icon">
                        <factor-icon icon="github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                    <a class="button is-medium">
                      <span class="icon">
                        <factor-icon icon="github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                    <a class="button is-large">
                      <span class="icon is-medium">
                        <factor-icon icon="github" />
                      </span>
                      <span>GitHub</span>
                    </a>
                  </p>
                  <p class="field">
                    <a class="button is-small">
                      <span class="icon is-small">
                        <factor-icon icon="header" />
                      </span>
                    </a>
                  </p>
                  <p class="field">
                    <a class="button">
                      <span class="icon is-small">
                        <factor-icon icon="header" />
                      </span>
                    </a>
                    <a class="button">
                      <span class="icon">
                        <factor-icon icon="header" class="fa-lg" />
                      </span>
                    </a>
                  </p>
                  <p class="field">
                    <a class="button is-medium">
                      <span class="icon is-small">
                        <factor-icon icon="header" />
                      </span>
                    </a>
                    <a class="button is-medium">
                      <span class="icon">
                        <factor-icon icon="header" class="fa-lg" />
                      </span>
                    </a>
                    <a class="button is-medium">
                      <span class="icon is-medium">
                        <factor-icon icon="header" class="fa-2x" />
                      </span>
                    </a>
                  </p>
                  <p class="field">
                    <a class="button is-large">
                      <span class="icon is-small">
                        <factor-icon icon="header" />
                      </span>
                    </a>
                    <a class="button is-large">
                      <span class="icon is-medium">
                        <factor-icon icon="header" class="fa-lg" />
                      </span>
                    </a>
                    <a class="button is-large">
                      <span class="icon is-large">
                        <factor-icon icon="header" class="fa-2x" />
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
                <div class="table-container">
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
                </div>
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
                        <factor-icon icon="user" />
                      </span>
                      <span class="icon is-small is-right">
                        <factor-icon icon="check" />
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
                        <factor-icon icon="envelope" />
                      </span>
                      <span class="icon is-small is-right">
                        <factor-icon icon="warning" />
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
                            <factor-icon icon="upload" />
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
                            <factor-icon icon="upload" />
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
                            <factor-icon icon="upload" />
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
                            <factor-icon icon="upload" />
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
                            <factor-icon icon="cloud-upload" />
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
                            <factor-icon icon="cloud-upload" />
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
                      <a class="button is-primary">Search</a>
                    </p>
                  </div>
                  <div class="field has-addons">
                    <p class="control">
                      <input class="input is-large" type="text" placeholder="Find a repository">
                    </p>
                    <p class="control">
                      <a class="button is-primary is-large">Search</a>
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
                      <a class="button is-primary">Search</a>
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
                        <factor-icon icon="envelope" />
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control has-icons-left">
                      <input class="input" type="password" placeholder="Password">
                      <span class="icon is-small is-left">
                        <factor-icon icon="lock" />
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button class="button is-primary">Login</button>
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
              <figure class="image is-16x16">
                <img src="https://source.unsplash.com/random/128x128">
              </figure>
              <br>
              <figure class="image is-32x32">
                <img src="https://source.unsplash.com/random/128x128">
              </figure>
              <br>
              <figure class="image is-64x64">
                <img src="https://source.unsplash.com/random/128x128">
              </figure>
              <br>
              <figure class="image is-128x128">
                <img src="https://source.unsplash.com/random/128x128">
              </figure>
              <br>
              <figure class="image is-128x128">
                <img class="is-rounded" src="https://source.unsplash.com/random/128x128">
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
              <div class="table-container">
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
              </div>
              <br>
              <br>
              <h2 class="subtitle">Striped</h2>
              <hr>
              <div class="table-container">
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
              </div>
              <br>
              <br>
              <h2 class="subtitle">Bordered</h2>
              <hr>
              <div class="table-container">
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
              </div>
              <br>
              <br>
              <h2 class="subtitle">Narrow</h2>
              <hr>
              <div class="table-container">
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
              </div>
              <br>
              <br>
              <h2 class="subtitle">Bordered, Striped, and Narrow</h2>
              <hr>
              <div class="table-container">
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
              </div>
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

            <section id="breadcrumb" class="section">
              <h1 class="title">Breadcrumb</h1>
              <hr>
              <nav class="breadcrumb">
                <ul>
                  <li>
                    <a>Bulma</a>
                  </li>
                  <li>
                    <a>Documentation</a>
                  </li>
                  <li>
                    <a>Components</a>
                  </li>
                  <li class="is-active">
                    <a>Breadcrumb</a>
                  </li>
                </ul>
              </nav>
            </section>

            <section id="dropdown" class="section">
              <h1 class="title">Dropdown</h1>
              <hr>
              <div class="columns">
                <div class="column">
                  <div class="dropdown is-hoverable">
                    <div class="dropdown-trigger">
                      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>Dropdown button</span>
                        <span class="icon is-small">
                          <factor-icon icon="angle-down" />
                        </span>
                      </button>
                    </div>
                    <div id="dropdown-menu" class="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        <a href="#" class="dropdown-item">Dropdown item</a>
                        <a class="dropdown-item">Other dropdown item</a>
                        <a href="#" class="dropdown-item is-active">Active dropdown item</a>
                        <a href="#" class="dropdown-item">Other dropdown item</a>
                        <hr class="dropdown-divider">
                        <a href="#" class="dropdown-item">With a divider</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="dropdown is-hoverable">
                    <div class="dropdown-trigger">
                      <button
                        class="button is-primary"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu2"
                      >
                        <span>Content</span>
                        <span class="icon is-small">
                          <factor-icon icon="angle-down" />
                        </span>
                      </button>
                    </div>
                    <div id="dropdown-menu2" class="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        <div class="dropdown-item">
                          <p>
                            You can insert
                            <strong>any type of content</strong> within the dropdown menu.
                          </p>
                        </div>
                        <hr class="dropdown-divider">
                        <div class="dropdown-item">
                          <p>
                            You simply need to use a
                            <code>&lt;div&gt;</code> instead.
                          </p>
                        </div>
                        <hr class="dropdown-divider">
                        <a href="#" class="dropdown-item">This is a link</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="card" class="section">
              <h1 class="title">Cards</h1>
              <hr>
              <div class="columns">
                <div class="column">
                  <div class="card">
                    <div class="card-image">
                      <figure class="image is-4by3">
                        <img src="https://source.unsplash.com/random/800x600" alt="Image">
                      </figure>
                    </div>
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image">
                            <img src="https://source.unsplash.com/random/40x40" alt="Image">
                          </figure>
                        </div>
                        <div class="media-content">
                          <p class="title is-4">Raymond Aleman</p>
                          <p class="subtitle is-6">@raymondaleman</p>
                        </div>
                      </div>
                      <div class="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                        <a>@factordev</a>.
                        <a>#css</a>
                        <a>#responsive</a>
                        <br>
                        <small>11:09 PM - 1 Jan 2016</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="card">
                    <header class="card-header">
                      <p class="card-header-title">Component</p>
                      <a class="card-header-icon">
                        <span class="icon">
                          <factor-icon icon="angle-down" />
                        </span>
                      </a>
                    </header>
                    <div class="card-content">
                      <div class="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                        <a>@fictioninc</a>.
                        <a>#css</a>
                        <a>#responsive</a>
                        <br>
                        <small>11:09 PM - 1 Jan 2016</small>
                      </div>
                    </div>
                    <footer class="card-footer">
                      <a class="card-footer-item">Save</a>
                      <a class="card-footer-item">Edit</a>
                      <a class="card-footer-item">Delete</a>
                    </footer>
                  </div>
                </div>
              </div>
            </section>

            <section id="hero" class="section">
              <h1 class="title">Hero</h1>
              <hr>
              <div class="container is-fluid is-marginless">
                <!-- is-widescreen is-fluid -->
                <section class="hero is-primary is-medium">
                  <!-- Hero head: will stick at the top -->
                  <div class="hero-head">
                    <nav class="navbar">
                      <div class="navbar-brand">
                        <factor-link path="#" class="navbar-item">
                          <theme-logo />
                        </factor-link>
                        <span class="navbar-burger burger" data-target="navbarMenuHeroA">
                          <span />
                          <span />
                          <span />
                        </span>
                      </div>
                      <div id="navbarMenuHeroA" class="navbar-menu">
                        <div class="navbar-end">
                          <a class="navbar-item is-active">Home</a>
                          <a class="navbar-item">Examples</a>
                          <a class="navbar-item">Documentation</a>
                          <span class="navbar-item">
                            <a class="button is-primary is-inverted">
                              <span class="icon">
                                <factor-icon icon="github" />
                              </span>
                              <span>Download</span>
                            </a>
                          </span>
                        </div>
                      </div>
                    </nav>
                  </div>

                  <!-- Hero content: will be in the middle -->
                  <div class="hero-body has-text-centered">
                    <h1 class="title">Title</h1>
                    <h2 class="subtitle">Subtitle</h2>
                  </div>

                  <!-- Hero footer: will stick at the bottom -->
                  <div class="hero-foot">
                    <nav class="tabs">
                      <ul>
                        <li class="is-active">
                          <a>Overview</a>
                        </li>
                        <li>
                          <a>Modifiers</a>
                        </li>
                        <li>
                          <a>Grid</a>
                        </li>
                        <li>
                          <a>Elements</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </section>
              </div>
            </section>

            <section id="level" class="section">
              <h1 class="title">Level</h1>
              <hr>
              <nav class="level">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Tweets</p>
                    <p class="title">3,456</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Following</p>
                    <p class="title">123</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Followers</p>
                    <p class="title">456K</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Likes</p>
                    <p class="title">789</p>
                  </div>
                </div>
              </nav>
              <br>
              <br>
              <nav class="level">
                <div class="level-item has-text-centered">
                  <a class="link is-info">Home</a>
                </div>
                <div class="level-item has-text-centered">
                  <a class="link is-info">Menu</a>
                </div>
                <div class="level-item has-text-centered">
                  <theme-logo />
                </div>
                <div class="level-item has-text-centered">
                  <a class="link is-info">Reservations</a>
                </div>
                <div class="level-item has-text-centered">
                  <a class="link is-info">Contact</a>
                </div>
              </nav>
            </section>

            <section id="media" class="section">
              <h1 class="title">Media Object</h1>
              <hr>
              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64">
                    <img src="https://source.unsplash.com/random/128x128" alt="Image">
                  </p>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>Raymond Aleman</strong>
                      <small>@raymondaleman</small>
                      <small>31m</small>
                      <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.
                    </p>
                  </div>
                  <nav class="level">
                    <div class="level-left">
                      <a class="level-item">
                        <span class="icon is-small">
                          <factor-icon icon="reply" />
                        </span>
                      </a>
                      <a class="level-item">
                        <span class="icon is-small">
                          <factor-icon icon="retweet" />
                        </span>
                      </a>
                      <a class="level-item">
                        <span class="icon is-small">
                          <factor-icon icon="heart" />
                        </span>
                      </a>
                    </div>
                  </nav>
                </div>
                <div class="media-right">
                  <button class="delete" />
                </div>
              </article>
              <hr>
              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64">
                    <img src="https://source.unsplash.com/random/128x128" alt="Image">
                  </p>
                </figure>
                <div class="media-content">
                  <div class="field">
                    <p class="control">
                      <textarea class="textarea" placeholder="Add a comment..." />
                    </p>
                  </div>
                  <nav class="level">
                    <div class="level-left">
                      <div class="level-item">
                        <a class="button is-info">Post comment</a>
                      </div>
                    </div>
                    <div class="level-right">
                      <div class="level-item">
                        <label class="checkbox">
                          <input type="checkbox"> Press enter to submit
                        </label>
                      </div>
                    </div>
                  </nav>
                </div>
              </article>
              <hr>
              <h4 class="subtitle">Nesting</h4>
              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64">
                    <img src="https://source.unsplash.com/random/128x128" alt="Image">
                  </p>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>Andrew Powers</strong>
                      <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porta eros lacus, nec ultricies elit blandit non. Suspendisse pellentesque mauris sit amet dolor blandit rutrum. Nunc in tempus turpis.
                      <br>
                      <small>
                        <a>Like</a> ·
                        <a>Reply</a> · 3 hrs
                      </small>
                    </p>
                  </div>
                  <article class="media">
                    <figure class="media-left">
                      <p class="image is-48x48">
                        <img src="https://source.unsplash.com/random/96x96" alt="Image">
                      </p>
                    </figure>
                    <div class="media-content">
                      <div class="content">
                        <p>
                          <strong>Justin Keller</strong>
                          <br>Donec sollicitudin urna eget eros malesuada sagittis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam blandit nisl a nulla sagittis, a lobortis leo feugiat.
                          <br>
                          <small>
                            <a>Like</a> ·
                            <a>Reply</a> · 2 hrs
                          </small>
                        </p>
                      </div>
                      <article
                        class="media"
                      >Vivamus quis semper metus, non tincidunt dolor. Vivamus in mi eu lorem cursus ullamcorper sit amet nec massa.</article>
                      <article
                        class="media"
                      >Morbi vitae diam et purus tincidunt porttitor vel vitae augue. Praesent malesuada metus sed pharetra euismod. Cras tellus odio, tincidunt iaculis diam non, porta aliquet tortor.</article>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <p class="image is-48x48">
                        <img src="https://source.unsplash.com/random/96x96" alt="Image">
                      </p>
                    </figure>
                    <div class="media-content">
                      <div class="content">
                        <p>
                          <strong>Dan Lynch</strong>
                          <br>Sed convallis scelerisque mauris, non pulvinar nunc mattis vel. Maecenas varius felis sit amet magna vestibulum euismod malesuada cursus libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus lacinia non nisl id feugiat.
                          <br>
                          <small>
                            <a>Like</a> ·
                            <a>Reply</a> · 2 hrs
                          </small>
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </article>
              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64">
                    <img src="https://source.unsplash.com/random/128x128" alt="Image">
                  </p>
                </figure>
                <div class="media-content">
                  <div class="field">
                    <p class="control">
                      <textarea class="textarea" placeholder="Add a comment..." />
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button class="button">Post comment</button>
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section id="menu" class="section">
              <h1 class="title">Menu</h1>
              <hr>
              <div class="column is-3">
                <aside class="menu">
                  <p class="menu-label">General</p>
                  <ul class="menu-list">
                    <li>
                      <a>Dashboard</a>
                    </li>
                    <li>
                      <a>Customers</a>
                    </li>
                  </ul>
                  <p class="menu-label">Administration</p>
                  <ul class="menu-list">
                    <li>
                      <a>Team Settings</a>
                    </li>
                    <li>
                      <a class="is-active">Manage Your Team</a>
                      <ul>
                        <li>
                          <a>Members</a>
                        </li>
                        <li>
                          <a>Plugins</a>
                        </li>
                        <li>
                          <a>Add a member</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a>Invitations</a>
                    </li>
                  </ul>
                </aside>
              </div>
            </section>

            <section id="message" class="section">
              <h1 class="title">Message</h1>
              <hr>
              <div class="columns is-multiline">
                <div class="column is-half">
                  <article class="message">
                    <div class="message-header">
                      <p>Message</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                  <br>
                  <article class="message is-info">
                    <div class="message-header">
                      <p>Info</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                  <br>
                  <article class="message is-warning">
                    <div class="message-header">
                      <p>Warning</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                  <br>
                  <article class="message is-white">
                    <div class="message-header">
                      <p>White</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                  <br>
                  <article class="message is-light">
                    <div class="message-header">
                      <p>Light</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                </div>

                <div class="column is-half">
                  <article class="message is-primary">
                    <div class="message-header">
                      <p>Primary</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                  <br>
                  <article class="message is-success">
                    <div class="message-header">
                      <p>Success</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                  <br>
                  <article class="message is-danger">
                    <div class="message-header">
                      <p>Danger</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                  <br>
                  <article class="message is-black">
                    <div class="message-header">
                      <p>Black</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                  <br>
                  <article class="message is-dark">
                    <div class="message-header">
                      <p>Dark</p>
                      <button class="delete" />
                    </div>
                    <div class="message-body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum
                      <a>felis venenatis</a> efficitur. Aenean ac
                      <em>eleifend lacus</em>.
                    </div>
                  </article>
                </div>
              </div>
            </section>

            <section id="modal" class="section">
              <h1 class="title">Modal</h1>
              <hr>
              <button
                class="button is-primary is-large modal-button"
                data-target="modal"
                aria-haspopup="true"
                @click="showModalExample = true"
              >Launch example modal</button>
              <div class="modal" :class="{ 'is-active' : showModalExample == true}">
                <div class="modal-background" @click="showModalExample = false" />
                <div class="modal-card">
                  <header class="modal-card-head">
                    <p class="modal-card-title title is-marginless">Any Elements Can Go Here</p>
                    <button class="delete" @click="showModalExample = false" />
                  </header>
                  <section
                    class="modal-card-body"
                  >Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</section>
                  <footer class="modal-card-foot">
                    <a class="button is-primary">Save changes</a>
                    <a class="button" @click="showModalExample = false">Cancel</a>
                  </footer>
                </div>
                <button
                  class="modal-close is-large"
                  aria-label="close"
                  @click="showModalExample = false"
                />
              </div>
            </section>

            <section id="navbar" class="section">
              <h1 class="title">Navbar</h1>
              <hr>

              <nav class="navbar">
                <div class="navbar-brand">
                  <app-link class="navbar-item" path="#">
                    <theme-logo />
                  </app-link>
                  <app-link class="navbar-item is-hidden-desktop" path="#" target="_blank">
                    <span class="icon">
                      <factor-icon icon="github" />
                    </span>
                  </app-link>
                  <app-link class="navbar-item is-hidden-desktop" path="#" target="_blank">
                    <span class="icon">
                      <factor-icon icon="twitter" />
                    </span>
                  </app-link>
                  <div class="navbar-burger burger" data-target="navMenuExample1">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div id="navMenuExample1" class="navbar-menu">
                  <div class="navbar-start">
                    <app-link class="navbar-item" path="#">Home</app-link>
                    <div class="navbar-item has-dropdown is-hoverable">
                      <app-link class="navbar-link is-active" path="#">Docs</app-link>
                      <div class="navbar-dropdown">
                        <app-link class="navbar-item" path="#">Overview</app-link>
                        <app-link class="navbar-item" path="#">Modifiers</app-link>
                        <app-link class="navbar-item is-active" path="#">Grid</app-link>
                        <app-link class="navbar-item" path="#">Elements</app-link>
                        <hr class="navbar-divider">
                        <div class="navbar-item">
                          <div>
                            version
                            <p class="has-text-primary is-size-6-desktop">0.7.3</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="navbar-item has-dropdown is-hoverable">
                      <app-link class="navbar-link" path="#">Blog</app-link>
                      <div id="blogDropdown" class="navbar-dropdown" data-style="width: 18rem;">
                        <app-link class="navbar-item" path="#">
                          <div class="navbar-content">
                            <p>
                              <small class="has-text-primary">10 Mar 2020</small>
                            </p>
                            <p>New field element (for better controls)</p>
                          </div>
                        </app-link>
                        <app-link class="navbar-item" path="#">
                          <div class="navbar-content">
                            <p>
                              <small class="has-text-primary">11 Apr 2020</small>
                            </p>
                            <p>Metro UI CSS grid with Bulma tiles</p>
                          </div>
                        </app-link>
                        <app-link class="navbar-item" path="#">
                          <div class="navbar-content">
                            <p>
                              <small class="has-text-primary">09 Feb 2020</small>
                            </p>
                            <p>Blog launched, new responsive columns, new helpers</p>
                          </div>
                        </app-link>

                        <app-link class="navbar-item" path="#">More posts</app-link>
                        <hr class="navbar-divider">
                        <div class="navbar-item">
                          <div class="navbar-content">
                            <div class="level is-mobile">
                              <div class="level-left">
                                <div class="level-item">
                                  <strong>Stay up to date!</strong>
                                </div>
                              </div>
                              <div class="level-right">
                                <div class="level-item">
                                  <app-link class="button is-rss is-small" path="#">
                                    <span class="icon is-small">
                                      <factor-icon icon="rss" />
                                    </span>
                                    <span>Subscribe</span>
                                  </app-link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="navbar-item has-dropdown is-hoverable">
                      <div class="navbar-link">More</div>
                      <div id="moreDropdown" class="navbar-dropdown">
                        <app-link class="navbar-item" path="#">
                          <div class="level is-mobile">
                            <div class="level-left">
                              <div class="level-item">
                                <p>
                                  <strong>Extensions</strong>
                                  <br>
                                  <small>Side projects to enhance Bulma</small>
                                </p>
                              </div>
                            </div>
                          </div>
                        </app-link>
                      </div>
                    </div>
                  </div>
                  <div class="navbar-end">
                    <app-link class="navbar-item" path="#">Github</app-link>
                    <app-link class="navbar-item" path="#">Twitter</app-link>
                    <div class="navbar-item">
                      <div class="field is-grouped">
                        <p class="control">
                          <app-link class="button" path="#">
                            <span class="icon">
                              <factor-icon icon="twitter" />
                            </span>
                            <span>Tweet</span>
                          </app-link>
                        </p>
                        <p class="control">
                          <app-link class="button is-primary" path="#">
                            <span class="icon">
                              <factor-icon icon="download" />
                            </span>
                            <span>Download</span>
                          </app-link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
              <br>
            </section>

            <section id="pagination" class="section">
              <h1 class="title">Pagination</h1>
              <hr>
              <nav class="pagination">
                <app-link class="pagination-previous is-disabled" path="#">Previous</app-link>
                <app-link class="pagination-next" path="#">Next</app-link>
                <ul class="pagination-list">
                  <li>
                    <app-link class="pagination-link">1</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-ellipsis">…</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-link">45</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-link">46</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-link">47</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-ellipsis">…</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-link">89</app-link>
                  </li>
                </ul>
              </nav>
              <br>
              <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                <app-link class="pagination-previous is-disabled" path="#">Previous</app-link>
                <app-link class="pagination-next" path="#">Next</app-link>
                <ul class="pagination-list">
                  <li>
                    <app-link class="pagination-link" aria-label="Goto page 1">1</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-ellipsis">…</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-link" aria-label="Goto page 45">45</app-link>
                  </li>
                  <li>
                    <app-link
                      class="pagination-link is-current"
                      aria-label="Goto page 46"
                      aria-current="page"
                    >46</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-link" aria-label="Goto page 47">47</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-ellipsis">…</app-link>
                  </li>
                  <li>
                    <app-link class="pagination-link" aria-label="Goto page 89">89</app-link>
                  </li>
                </ul>
              </nav>
            </section>

            <section id="panel" class="section">
              <h1 class="title">Panel</h1>
              <hr>
              <div class="column is-4">
                <nav class="panel">
                  <p class="panel-heading">Repositories</p>
                  <div class="panel-block">
                    <p class="control has-icons-left">
                      <input class="input is-small" type="text" placeholder="Search">
                      <span class="icon is-small is-left">
                        <factor-icon icon="search" />
                      </span>
                    </p>
                  </div>
                  <p class="panel-tabs">
                    <app-link class="is-active">All</app-link>
                    <app-link>Public</app-link>
                    <app-link>Private</app-link>
                    <app-link>Sources</app-link>
                  </p>
                  <a class="panel-block is-active">
                    <span class="panel-icon">
                      <factor-icon icon="book" />
                    </span> fiction
                  </a>
                  <a class="panel-block">
                    <span class="panel-icon">
                      <factor-icon icon="book" />
                    </span> marksheet
                  </a>
                  <a class="panel-block">
                    <span class="panel-icon">
                      <factor-icon icon="book" />
                    </span> reset.css
                  </a>
                  <a class="panel-block">
                    <span class="panel-icon">
                      <factor-icon icon="book" />
                    </span> raymondaleman.github.io
                  </a>
                  <a class="panel-block">
                    <span class="panel-icon">
                      <factor-icon icon="code-fork" />
                    </span> fiction-com/factor
                  </a>
                  <a class="panel-block">
                    <span class="panel-icon">
                      <factor-icon icon="code-fork" />
                    </span> fiction-com
                  </a>
                  <label class="panel-block">
                    <input type="checkbox"> Remember me
                  </label>
                  <div class="panel-block">
                    <button class="button is-primary is-outlined is-fullwidth">Reset all filters</button>
                  </div>
                </nav>
              </div>
            </section>

            <section id="tabs" class="section">
              <h1 class="title">Tabs</h1>
              <hr>
              <div class="tabs">
                <ul>
                  <li class="is-active">
                    <app-link>Pictures</app-link>
                  </li>
                  <li>
                    <app-link>Music</app-link>
                  </li>
                  <li>
                    <app-link>Videos</app-link>
                  </li>
                  <li>
                    <app-link>Documents</app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-centered">
                <ul>
                  <li class="is-active">
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="image" />
                      </span>
                      <span>Pictures</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="music" />
                      </span>
                      <span>Music</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="film" />
                      </span>
                      <span>Videos</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="file-text-o" />
                      </span>
                      <span>Documents</span>
                    </app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-small">
                <ul>
                  <li class="is-active">
                    <app-link>Pictures</app-link>
                  </li>
                  <li>
                    <app-link>Music</app-link>
                  </li>
                  <li>
                    <app-link>Videos</app-link>
                  </li>
                  <li>
                    <app-link>Documents</app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-medium">
                <ul>
                  <li class="is-active">
                    <app-link>Pictures</app-link>
                  </li>
                  <li>
                    <app-link>Music</app-link>
                  </li>
                  <li>
                    <app-link>Videos</app-link>
                  </li>
                  <li>
                    <app-link>Documents</app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-large">
                <ul>
                  <li class="is-active">
                    <app-link>Pictures</app-link>
                  </li>
                  <li>
                    <app-link>Music</app-link>
                  </li>
                  <li>
                    <app-link>Videos</app-link>
                  </li>
                  <li>
                    <app-link>Documents</app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-boxed">
                <ul>
                  <li class="is-active">
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="image" />
                      </span>
                      <span>Pictures</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="music" />
                      </span>
                      <span>Music</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="film" />
                      </span>
                      <span>Videos</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="file-text-o" />
                      </span>
                      <span>Documents</span>
                    </app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-toggle">
                <ul>
                  <li class="is-active">
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="image" />
                      </span>
                      <span>Pictures</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="music" />
                      </span>
                      <span>Music</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="film" />
                      </span>
                      <span>Videos</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="file-text-o" />
                      </span>
                      <span>Documents</span>
                    </app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-toggle is-toggle-rounded">
                <ul>
                  <li class="is-active">
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="image" />
                      </span>
                      <span>Pictures</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="music" />
                      </span>
                      <span>Music</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="film" />
                      </span>
                      <span>Videos</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="file-text-o" />
                      </span>
                      <span>Documents</span>
                    </app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-fullwidth">
                <ul>
                  <li>
                    <app-link>
                      <span class="icon">
                        <factor-icon icon="angle-left" />
                      </span>
                      <span>Left</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon">
                        <factor-icon icon="angle-up" />
                      </span>
                      <span>Up</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span>Right</span>
                      <span class="icon">
                        <factor-icon icon="angle-right" />
                      </span>
                    </app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-centered is-boxed">
                <ul>
                  <li class="is-active">
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="image" />
                      </span>
                      <span>Pictures</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="music" />
                      </span>
                      <span>Music</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="film" />
                      </span>
                      <span>Videos</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon is-small">
                        <factor-icon icon="file-text-o" />
                      </span>
                      <span>Documents</span>
                    </app-link>
                  </li>
                </ul>
              </div>
              <br>
              <div class="tabs is-toggle is-fullwidth is-large">
                <ul>
                  <li class="is-active">
                    <app-link>
                      <span class="icon">
                        <factor-icon icon="image" />
                      </span>
                      <span>Pictures</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon">
                        <factor-icon icon="music" />
                      </span>
                      <span>Music</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon">
                        <factor-icon icon="film" />
                      </span>
                      <span>Videos</span>
                    </app-link>
                  </li>
                  <li>
                    <app-link>
                      <span class="icon">
                        <factor-icon icon="file-text-o" />
                      </span>
                      <span>Documents</span>
                    </app-link>
                  </li>
                </ul>
              </div>
            </section>

            <section id="more" class="section">
              <h1 class="title">Learn More</h1>
              <hr>Even more elements like a versatile delete section, icon containers, etc. Learn more on the
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
  components: {
    "theme-logo": () => import("./logo")
  },
  data() {
    return {
      loading: true,
      showModalExample: false
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