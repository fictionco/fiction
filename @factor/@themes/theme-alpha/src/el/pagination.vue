<template>
  <div class="pagination">
    <ul>
      <li class="active">
        <a href="#" aria-label="Current page">1</a>
      </li>
      <li>
        <a href="#">2</a>
      </li>
      <li>
        <a href="#">3</a>
      </li>
      <li class="pagination-omission">…</li>
      <li>
        <a href="#">7</a>
      </li>
      <li class="pagination-next app-link is-btn">
        <button type="button" class="el-btn el-btn-load default">
          <a href="#" class="btn btn-default">
            <span class="btn-content">Next Page</span>
          </a>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="less">
.pagination {
  display: block;
  margin: 50px auto 0;
  position: relative;
  width: auto;
  text-align: center;
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      display: inline-block;
      margin: 0.5em 0;
      &.active a {
        border-bottom: 2px solid #0496ff;
        color: #0496ff;
      }
      &.pagination-next {
        margin-left: 0.5em;
      }
      a {
        color: inherit;
        cursor: pointer;
        margin-bottom: 4px;
        padding: 3px 7px;
      }
    }
  }
}
</style>