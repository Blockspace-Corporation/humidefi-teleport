/**
 * In this example, we are creating a `SubmittableExtrinsic` and showing how one may sign and send it over
 * a network. Since it is the `SubmittableExtrinsic`, there are a plethora of attached methods to use such as:
 *
 * `sign`, `signAsync`, `dryRun`, `addSignature`, `paymentInfo`, etc.
 */

/**
 * Option that specifies the format in which to return a transaction.
 * It can either be a `payload`, `call`, or `submittable`.
 *
 * Note: A `submittable` will return a `SubmittableExtrinsic` polkadot-js type, whereas
 * a `payload` or `call` will return a hex. By default a `payload` will be returned if nothing is inputted.
 */

const submittable = async () => {
	const { Keyring } = require('@polkadot/keyring');
	const { cryptoWaitReady } = require('@polkadot/util-crypto');
	const { AssetTransferApi, TxResult, constructApiPromise } = require('@substrate/asset-transfer-api');

	const { api, specName, safeXcmVersion } = await constructApiPromise('ws://127.0.0.1:9944');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	// When declaring this type it will ensure that the inputted `format` matches it or the type checker will error.
	// let callInfo: TxResult<'submittable'>;
	let callInfo;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'1000', // Specify parachain system ID
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['ROC'],
			['1000000000000'],
			{
				format: 'submittable',
				isLimited: true,
				xcmVersion: 2,
			},
		);
	} catch (e) {
		console.error(e);
		throw Error(e);
	}

	await cryptoWaitReady();
	// Create a new keyring, and add an "Alice" account
	const keyring = new Keyring();
	const alice = keyring.addFromUri('//Alice', { name: 'Alice' }, 'sr25519');

	await callInfo.tx.signAndSend(alice);
};

submittable()
	.catch((err) => console.error(err))
	.finally(() => process.exit());