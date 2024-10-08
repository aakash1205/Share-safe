const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

const credential = new DefaultAzureCredential();
const vaultName = process.env.KEY_VAULT_NAME;
const keyVaultUrl = `https://${vaultName}.vault.azure.net/`;
const client = new SecretClient(keyVaultUrl, credential);

const getSecret = async (secretName) => {
    const secret = await client.getSecret(secretName);
    return secret.value;
};

module.exports = { getSecret };
