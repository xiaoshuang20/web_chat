<template>
  <div class="web_chat">
    <router-view></router-view>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
.web_chat {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  background: url('/static/img/bgc.jpg') no-repeat center;
  background-size: cover;

  :deep(.group) {
    position: relative;

    .el-dialog__header {
      .group_input {
        width: 48%;

        .el-input__wrapper {
          background-color: #e8e8e8;
        }
      }

      .el-divider {
        position: absolute;
        top: 0;
        left: 48.5%;
        height: 100%;
      }

      .text {
        margin-left: 40px;
      }
    }

    .el-dialog__body {
      padding: 6px 0 0 0;

      .group_content {
        display: flex;
        height: 300px;
        width: 100%;

        .group_all {
          flex: 1;

          .container {
            height: 100%;
            overflow: hidden;

            .select {
              background-color: #d5d4d4;
            }

            ul > li {
              padding: 12px 26px 12px 20px;
              display: flex;
              align-items: center;

              &:hover {
                background-color: #e8e7e7;
              }

              .left {
                flex: 1;
              }

              .center {
                flex: 3;
                margin-left: 10px;

                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .right {
                flex: 1;
                display: flex;
                justify-content: end;
              }
            }

            &[_scroll='true']:hover {
              overflow-y: auto;
              li {
                padding-right: 20px;
              }
            }
            &::-webkit-scrollbar {
              width: 6px;
            }
            &::-webkit-scrollbar-thumb {
              background: #dbdbdb;
              border-radius: 8px;
              opacity: 0.6;
            }
          }
        }

        .group_select {
          flex: 1;

          .container {
            height: 80%;
            overflow: hidden;
            padding-right: 6px;

            ul > li {
              padding: 12px 20px;
              display: flex;
              align-items: center;

              .left {
                flex: 1;
              }

              .center {
                flex: 3;
                margin-left: 10px;

                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .right {
                flex: 1;
                display: flex;
                justify-content: end;
                font-size: 16px;

                .icon {
                  &:hover {
                    cursor: pointer;
                    color: #b8b8b8;
                  }
                }
              }
            }

            &[_scroll='true']:hover {
              overflow-y: auto;
              padding-right: 0;
            }
            &::-webkit-scrollbar {
              width: 6px;
            }
            &::-webkit-scrollbar-thumb {
              background: #dbdbdb;
              border-radius: 8px;
              opacity: 0.6;
            }
          }

          .footer {
            height: 20%;
            padding-right: 16px;
            display: flex;
            justify-content: end;
            align-items: center;
          }
        }
      }
    }

    .el-dialog__footer {
      display: none;
    }
  }
}
</style>
