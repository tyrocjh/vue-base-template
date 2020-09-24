<template>
  <div class="about">
    <span @click="handleScan">扫一扫</span>
    <br /><br />
    <span @click="handleNfc">读取NFC</span>
    <br /><br />
    <span @click="handleBlueTooth">蓝牙</span>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      ua: '',
      dd: null
    }
  },
  created() {
    this.ua = navigator.userAgent.toLocaleLowerCase()
    this.importScripts()
  },
  methods: {
    // 引入客户端jssdk
    importScripts() {
      if (this.ua.indexOf('miniprogram') !== -1 || this.ua.indexOf('micromessenger') !== -1) {
        this.createScript('http://res.wx.qq.com/open/js/jweixin-1.6.0.js')
      } else if (this.ua.indexOf('dingtalk') !== -1) {
        this.dd = require('dingtalk-jsapi')
      } else if (this.ua.indexOf('alipay') !== -1) {
        this.createScript('https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js')
      }
    },
    // 加载外链js
    createScript(link) {
      let oScript = document.createElement('script');
      oScript.type = 'text/javascript';
      oScript.src = link;
      document.body.appendChild(oScript);
    },
    // 扫一扫
    handleScan() {
      console.info(this.ua)
      if (this.ua.indexOf('micromessenger') !== -1) {
        window.wx.scanQRCode({
          success(res) {
            alert(JSON.stringify(res))
          },
          fail(err) {
            alert(JSON.stringify(err))
          }
        })
      } else if (this.ua.indexOf('miniprogram') !== -1) {
        window.wx.scanQRCode({
          scanType: ["qrCode"],
          success(res) {
            alert(JSON.stringify(res))
          },
          fail(err) {
            alert(JSON.stringify(err))
          }
        })
      } else if (this.ua.indexOf('dingtalk') !== -1) {
        this.dd.biz.util.scan({
          type: 'qrCode',
          onSuccess(data) {
            alert(data.text)
          },
          onFail(err) {
            alert('err: ' + JSON.stringify(err))
          }
        })
      } else if (this.ua.indexOf('alipay') !== -1) {
        window.ap.scan({
          type: 'bar'
        }, res => {
          alert(res.code)
        })
      } else {
        alert('不支持扫一扫功能~')
      }
    },
    // NFC
    handleNfc() {
      if (this.ua.indexOf('miniprogram') !== -1) {
        window.wx.miniProgram.navigateTo({url: '/pages/nfc/nfc?id=1'})
      } else if (this.ua.indexOf('dingtalk') !== -1) {
        this.dd.device.nfc.nfcRead({
          onSuccess(data) {
            alert(JSON.stringify(data))
          },
          onFail(err) {
            alert('err: ' + JSON.stringify(err))
          }
        })
      } else {
        alert('不支持NFC功能~')
      }
    },
    // 蓝牙
    handleBlueTooth() {
      if (this.ua.indexOf('alipay') !== -1) {
        window.ap.openBluetoothAdapter({
          success(res) {
            if (res.isSupportBLE) {
              // window.ap.onBluetoothDeviceFound(data => {
                // window.ap.stopBluetoothDevicesDiscovery()
                // alert(JSON.stringify(data))
              // })
              window.ap.startBluetoothDevicesDiscovery()
              window.ap.getBluetoothDevices({
                success(data) {
                  alert(JSON.stringify(data))
                }
              })
            } else {
              alert('不支持蓝牙功能~')
            }
          },
          fail(err) {
            alert(JSON.stringify(err))
          }
        })
      } else {
        alert('不支持蓝牙功能~')
      }
    }
  }
}
</script>
