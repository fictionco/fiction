<template>
  <factor-input-wrap class="dashboard-input" v-bind="$attrs" v-on="$listeners">
    <slot />
  </factor-input-wrap>
</template>

<style lang="less">
.dashboard-input {
  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: var(--color-placeholder);
  }

  input,
  select,
  textarea {
    resize: none;
    border: 0;
    font-size: 1em;
    box-shadow: none;
    padding: 0;
  }

  button,
  select,
  input,
  textarea,
  select,
  .checkbox-label {
    font-family: var(--font-primary);
  }

  input[type="email"],
  input[type="password"],
  input[type="search"],
  input[type="tel"],
  input[type="text"],
  textarea,
  select {
    -webkit-appearance: none;
    background-color: var(--input-bg);
    box-shadow: var(--input-shadow);
    border-radius: 4px;
  }

  input,
  textarea {
    line-height: 1.2;
  }

  [type="checkbox"],
  [type="radio"] {
    margin: 0;
    width: auto;
    display: inline-block;
    box-shadow: none;
  }

  input,
  textarea,
  select {
    display: inline-block;
    padding: 0.5em;
    font-size: 1em;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;
    border: 0;
    font-weight: 500;
    color: var(--color-text);

    &.disabled {
      opacity: 0.5;
    }

    &.dropdown,
    &.toggle,
    &.range {
      border: 0;

      &:hover,
      &:focus {
        border: none;
      }
    }

    &::placeholder {
      /* Chrome/Opera/Safari */
      color: var(--color-placeholder);
    }
  }

  .image-upload-input {
    .validity {
      position: absolute;
      height: 0;
      width: 0;
      left: 50%;
    }

    flex-basis: 100%;
    max-width: 100%;
    position: relative;
    .image-organizer {
      display: grid;
      //grid-auto-columns: minmax(10px, 80px);
      grid-template-columns: repeat(auto-fit, minmax(50px, 60px));
      grid-gap: 7px;
      &.hidden {
        display: none;
      }

      transition: opacity 0.5s;
    }
  }
  .image-item {
    position: relative;

    display: block;
    &.sort-img {
      cursor: grab;
    }

    .image-item-pad {
      width: 100%;
      height: 100%;
    }
  }
  .image-upload-container {
    .invisible-copy {
      position: absolute;
      left: -9999px;
    }
  }
  .image-upload-container .image-status {
    line-height: 1.2;
    text-align: center;
    position: relative;
    padding: 2px;

    line-height: 1;
    border-radius: 5px;
    opacity: 1;
    height: 5px;

    &.overlay {
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 10%;
      left: 10%;
      width: 80%;
    }
    &.complete {
      color: #fff;
    }
    .bar {
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(255, 255, 255, 1);
      width: 0%;
      height: 100%;
      border-radius: 8px;
      transition: width 0.8s;
      transition: all 0.2s;
    }
    &.menu {
      height: 100%;
      width: 100%;
      .toggle-btn {
        opacity: 0;
        height: 100%;
      }
    }
  }

  .image-item-content {
    box-shadow: inset var(--input-shadow);

    background-color: var(--input-bg);

    &.preprocess {
      background-color: var(--color-text);
    }
  }
  .image-drop .image-item-content {
    color: var(--color-placeholder);
    background-color: var(--input-bg);
    box-shadow: inset var(--input-shadow);
  }

  .sortable-items {
    .controls {
      .sortable-item {
        box-shadow: var(--input-shadow);

        &.active {
          background: var(--canvas-bg);
        }
      }
    }

    .inputs {
      box-shadow: var(--input-shadow);
    }
  }

  .card-user {
    .card {
      box-shadow: var(--input-shadow);
    }
  }

  .el-tag {
    box-shadow: var(--input-shadow);
  }
}
</style>