// source: rpc.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.RpcMessage', null, global);
goog.exportSymbol('proto.RpcMessage.Payload', null, global);
goog.exportSymbol('proto.RpcMessage.Result', null, global);
goog.exportSymbol('proto.RpcMessage.Source', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.RpcMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.RpcMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.RpcMessage.displayName = 'proto.RpcMessage';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.RpcMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.RpcMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.RpcMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RpcMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    result: jspb.Message.getFieldWithDefault(msg, 2, 0),
    version: jspb.Message.getFieldWithDefault(msg, 3, ""),
    service: jspb.Message.getFieldWithDefault(msg, 4, ""),
    source: jspb.Message.getFieldWithDefault(msg, 5, 0),
    contextId: jspb.Message.getFieldWithDefault(msg, 6, 0),
    payloadData: msg.getPayloadData_asB64(),
    payloadClass: jspb.Message.getFieldWithDefault(msg, 8, 0),
    compress: jspb.Message.getBooleanFieldWithDefault(msg, 10, false),
    paging: jspb.Message.getFieldWithDefault(msg, 11, 0),
    limit: jspb.Message.getFieldWithDefault(msg, 12, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.RpcMessage}
 */
proto.RpcMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.RpcMessage;
  return proto.RpcMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.RpcMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.RpcMessage}
 */
proto.RpcMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {!proto.RpcMessage.Result} */ (reader.readEnum());
      msg.setResult(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setVersion(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setService(value);
      break;
    case 5:
      var value = /** @type {!proto.RpcMessage.Source} */ (reader.readEnum());
      msg.setSource(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setContextId(value);
      break;
    case 7:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPayloadData(value);
      break;
    case 8:
      var value = /** @type {!proto.RpcMessage.Payload} */ (reader.readEnum());
      msg.setPayloadClass(value);
      break;
    case 10:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setCompress(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPaging(value);
      break;
    case 12:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLimit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.RpcMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.RpcMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.RpcMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RpcMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getResult();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getVersion();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getService();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getSource();
  if (f !== 0.0) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = message.getContextId();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = message.getPayloadData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      7,
      f
    );
  }
  f = message.getPayloadClass();
  if (f !== 0.0) {
    writer.writeEnum(
      8,
      f
    );
  }
  f = message.getCompress();
  if (f) {
    writer.writeBool(
      10,
      f
    );
  }
  f = message.getPaging();
  if (f !== 0) {
    writer.writeInt64(
      11,
      f
    );
  }
  f = message.getLimit();
  if (f !== 0) {
    writer.writeInt64(
      12,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.RpcMessage.Result = {
  RESULT_NONE: 0,
  INVALID_VERSION: 2,
  INVALID_SERVICE: 3,
  INVALID_PAYLOAD: 4,
  NOT_AUTHENTICATED: 5,
  SERVICE_TIMEOUT: 6,
  SERVICE_REJECTED: 7,
  SERVICE_UNAVAILABLE: 8,
  REQUIRE_VPN: 9,
  MAINTAINANCE: 10,
  INTERNAL_ERROR: 99,
  SUCCESS: 100
};

/**
 * @enum {number}
 */
proto.RpcMessage.Source = {
  SOURCE_NONE: 0,
  IOS: 1,
  ANDROID: 2,
  EXTERNAL: 9,
  WEB: 10
};

/**
 * @enum {number}
 */
proto.RpcMessage.Payload = {
  PAYLOAD_NONE: 0,
  AUTHEN_REQ: 1,
  HEARTBEAT_REQ: 2,
  AUTHEN_RES: 11,
  HEARTBEAT_RES: 12,
  LAST_QUOTE_REQ: 20,
  SUBSCRIBE_QUOTE_REQ: 21,
  UNSUBSCRIBE_QUOTE_REQ: 22,
  CHART_REQ: 23,
  QUOTE_EVENT: 29,
  LAST_QUOTE_RES: 30,
  SUBSCRIBE_QUOTE_RES: 31,
  UNSUBSCRIBE_QUOTE_RES: 32,
  CHART_RES: 33,
  NEW_ORDER_SINGLE_REQ: 60,
  NEW_ORDER_MULTI_REQ: 61,
  CLOSE_ORDER_REQ: 62,
  MODIFY_ORDER_REQ: 63,
  CANCEL_ORDER_REQ: 64,
  ORDER_EVENT: 68,
  NEW_ORDER_SINGLE_RES: 70,
  NEW_ORDER_MULTI_RES: 71,
  CLOSE_ORDER_RES: 72,
  MODIFY_ORDER_RES: 73,
  CANCEL_ORDER_RES: 74,
  BALANCE_UPDATE_REQ: 80,
  ACCOUNT_CREATE_REQ: 81,
  ACCOUNT_UPDATE_REQ: 82,
  ACCOUNT_DETAIL_REQ: 83,
  ACCOUNT_CREATE_MULTI_REQ: 84,
  ACCOUNT_BALANCE_REQ: 85,
  BALANCE_UPDATE_RES: 90,
  ACCOUNT_CREATE_RES: 91,
  ACCOUNT_UPDATE_RES: 92,
  ACCOUNT_DETAIL_RES: 93,
  ACCOUNT_CREATE_MULTI_RES: 94,
  ACCOUNT_BALANCE_RES: 95,
  POSITION_REQ: 100,
  ORDER_LIST_REQ: 101,
  CONTRACT_LIST_REQ: 102,
  SYMBOL_LIST_REQ: 103,
  POSITION_RES: 110,
  ORDER_LIST_RES: 111,
  CONTRACT_LIST_RES: 112,
  SYMBOL_LIST_RES: 113,
  SPAN_SIMULATE_REQ: 120,
  SPAN_SIMULATE_RES: 130
};

/**
 * optional int64 id = 1;
 * @return {number}
 */
proto.RpcMessage.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional Result result = 2;
 * @return {!proto.RpcMessage.Result}
 */
proto.RpcMessage.prototype.getResult = function() {
  return /** @type {!proto.RpcMessage.Result} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.RpcMessage.Result} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setResult = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional string version = 3;
 * @return {string}
 */
proto.RpcMessage.prototype.getVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setVersion = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string service = 4;
 * @return {string}
 */
proto.RpcMessage.prototype.getService = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setService = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional Source source = 5;
 * @return {!proto.RpcMessage.Source}
 */
proto.RpcMessage.prototype.getSource = function() {
  return /** @type {!proto.RpcMessage.Source} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {!proto.RpcMessage.Source} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setSource = function(value) {
  return jspb.Message.setProto3EnumField(this, 5, value);
};


/**
 * optional int64 context_id = 6;
 * @return {number}
 */
proto.RpcMessage.prototype.getContextId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setContextId = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional bytes payload_data = 7;
 * @return {!(string|Uint8Array)}
 */
proto.RpcMessage.prototype.getPayloadData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * optional bytes payload_data = 7;
 * This is a type-conversion wrapper around `getPayloadData()`
 * @return {string}
 */
proto.RpcMessage.prototype.getPayloadData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPayloadData()));
};


/**
 * optional bytes payload_data = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPayloadData()`
 * @return {!Uint8Array}
 */
proto.RpcMessage.prototype.getPayloadData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPayloadData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setPayloadData = function(value) {
  return jspb.Message.setProto3BytesField(this, 7, value);
};


/**
 * optional Payload payload_class = 8;
 * @return {!proto.RpcMessage.Payload}
 */
proto.RpcMessage.prototype.getPayloadClass = function() {
  return /** @type {!proto.RpcMessage.Payload} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {!proto.RpcMessage.Payload} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setPayloadClass = function(value) {
  return jspb.Message.setProto3EnumField(this, 8, value);
};


/**
 * optional bool compress = 10;
 * @return {boolean}
 */
proto.RpcMessage.prototype.getCompress = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 10, false));
};


/**
 * @param {boolean} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setCompress = function(value) {
  return jspb.Message.setProto3BooleanField(this, 10, value);
};


/**
 * optional int64 paging = 11;
 * @return {number}
 */
proto.RpcMessage.prototype.getPaging = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
};


/**
 * @param {number} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setPaging = function(value) {
  return jspb.Message.setProto3IntField(this, 11, value);
};


/**
 * optional int64 limit = 12;
 * @return {number}
 */
proto.RpcMessage.prototype.getLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 12, 0));
};


/**
 * @param {number} value
 * @return {!proto.RpcMessage} returns this
 */
proto.RpcMessage.prototype.setLimit = function(value) {
  return jspb.Message.setProto3IntField(this, 12, value);
};


goog.object.extend(exports, proto);
