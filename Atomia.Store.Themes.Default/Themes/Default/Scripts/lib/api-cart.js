﻿/* jshint -W079 */
var Atomia = Atomia || {};
Atomia._unbound = Atomia._unbound || {};
/* jshint +W079 */

Atomia._unbound.Cart = function (_, ko, amplify) {
    'use strict';

    function AddItem(item, success, error) {
        var requestData;

        if (!_.has(item, 'ArticleNumber')) {
            throw new Error('Object must have ArticleNumber property to be added to cart.');
        }

        requestData = _.omit(item, function (value) {
            return _.isFunction(value);
        });

        _.defaults(requestData, {
            RenewalPeriod: {
                Period: 1,
                Unit: 'YEAR'
            },
            Quantity: 1
        });

        amplify.request({
            resourceId: 'Cart.AddItem',
            data: requestData,
            success: function (result) {
                item.CartItemId = result.CartItemId;

                if (success !== undefined) {
                    success(result);
                }
            },
            error: function (result) {
                if (error !== undefined) {
                    error(result);
                }
            }
        });
    }

    function RemoveItem(item, success, error) {
        var requestData;

        if (!_.has(item, 'CartItemId')) {
            throw new Error('Object must have CartItemId property to be removed from cart.');
        }

        requestData = {
            Id: item.CartItemId
        };

        amplify.request({
            resourceId: 'Cart.RemoveItem',
            data: requestData,
            success: function (result) {
                delete item.CartItemId;

                if (success !== undefined) {
                    success(result);
                }
            },
            error: function (result) {
                if (error !== undefined) {
                    error(result);
                }
            }
        });
    }

    return {
        AddItem: AddItem,
        RemoveItem: RemoveItem
    };
};

Atomia.Cart = Atomia._unbound.Cart(_, ko, amplify);
