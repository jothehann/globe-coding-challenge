import { faker } from '@faker-js/faker';
import { UserType } from '../types/userType';

/**
 * Generates a user object with random first name, last name, and email address.
 *
 * @param gender - The gender to use for generating the first name. Can be "male" or "female". Defaults to "male".
 * @returns A user object containing `firstName`, `lastName`, and `email`.
 */
export function generateUser(gender: 'male' | 'female' = 'male'): UserType {
	const firstName = faker.person.firstName(gender);
	const lastName = faker.person.lastName('male');
	return {
		firstName,
		lastName,
		email: `auto.${firstName.toLowerCase()}.${faker.string.numeric(6)}@test.com`,
	};
}
