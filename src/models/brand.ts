declare const __brand: unique symbol;

export type Brand<T, B extends string> = T & {
	readonly [__brand]?: B;
};

export type BrandedId<B extends string> = BrandedString<B>;
export type BrandedString<B extends string> = Brand<string, B>;

export type Guid = BrandedId<"guid">;

export type DateString = BrandedString<"date">;
export type DateOnlyString = BrandedString<"dateonly">;
export type DateNumber = Brand<number, "date">;
