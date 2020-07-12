//@flow

const awilix = require("awilix");

function emptyContainer() {
  const container = awilix.createContainer();

  // $FlowExpectedError
  container.cradle.foo = "bar";
}

function containerOptions() {
  awilix.createContainer({});
  // $FlowExpectedError
  awilix.createContainer({
    name: "test"
  });
  awilix.createContainer({ require });
  awilix.createContainer({
    require,
    resolutionMode: awilix.ResolutionMode.CLASSIC
  });
}

function register() {
  const validOpts = [
    { name: "test" },
    { name: "test", lifetime: awilix.Lifetime.SCOPED },
    {
      name: "test",
      lifetime: awilix.Lifetime.SCOPED,
      resolutionMode: awilix.ResolutionMode.PROXY
    },
    {
      name: "test",
      lifetime: awilix.Lifetime.SCOPED,
      resolutionMode: awilix.ResolutionMode.PROXY,
      injector: container => ({})
    },
    {
      name: "test",
      lifetime: awilix.Lifetime.SCOPED,
      resolutionMode: awilix.ResolutionMode.PROXY,
      injector: container => ({}),
      register: awilix.asClass
    }
  ];

  const asValue = awilix.asValue;
  let container = awilix.createContainer();

  for (let i = 0; i < validOpts.length; i++) {
    container.register(
      {
        foo: asValue("bar")
      },
      validOpts[i]
    );
  }

  // $FlowExpectedError
  container.cradle.foo = "baz";

  container = container.register({
    foo: asValue("bar")
  });

  container.cradle.foo = "baz";

  // $FlowExpectedError
  container.cradle.num += 123;

  container = container.register({
    num: asValue(123)
  });

  container.cradle.num += 123;

  // $FlowExpectedError
  container.cradle.nested.object.is.deeply.nested = 1;

  container = container.register({
    nested: asValue({
      object: {
        is: {
          deeply: {
            nested: 2,
            nestedString: "foo"
          }
        }
      }
    })
  });

  container.cradle.nested.object.is.deeply.nested++;

  // $FlowExpectedError
  container.cradle.nested.object.is.deeply.nestedString++;

  let aBool: boolean = true;

  // $FlowExpectedError
  aBool = container.cradle.another;

  container = container.register({ another: asValue(true) });

  aBool = container.cradle.another;
}

function registerClass() {
  let container = awilix.createContainer();
  const asClass = awilix.asClass;

  class TestOne {}

  class TestTwo {}

  class TestThree {}

  let test: TestOne;

  // $FlowExpectedError
  test = container.cradle.TestOne;

  container = container.registerClass(TestOne);

  test = container.cradle.TestOne;

  let test2: TestTwo;

  // $FlowExpectedError
  test2 = container.cradle.TestTwo;

  container = container.registerClass("TestDos", TestTwo);

  test2 = container.cradle.TestDos;

  container = container.registerClass("TestTres", [TestTwo, {}]);

  test2 = container.cradle.TestTres;

  let test3: TestThree;

  // $FlowExpectedError
  test3 = container.cradle.TestThree;

  container = container.registerClass([TestThree, {}]);

  test3 = container.cradle.TestThree;
}

function registerFunction() {
  const asFunction = awilix.asFunction;
  let container = awilix.createContainer();

  let test: boolean;

  // $FlowExpectedError
  test = container.cradle.boo;

  function boo() {
    return 123;
  }

  container = container.registerFunction(boo);

  let test1: number = container.cradle.boo;
  // $FlowExpectedError
  let test2: boolean = container.cradle.boo;

  container = container.registerFunction("boo2", boo);

  test1 = container.cradle.boo2;
  // $FlowExpectedError
  test2 = container.cradle.boo2;

  container = container.registerFunction("boo3", boo);

  test1 = container.cradle.boo3;
  // $FlowExpectedError
  test2 = container.cradle.boo3;

  container = container.registerFunction({
    boo4: boo
  });

  test1 = container.cradle.boo4;
  // $FlowExpectedError
  test2 = container.cradle.boo4;
}

function registerValue() {
  let container = awilix.createContainer();
  container = container.registerValue("foo", "bar");

  // $FlowExpectedError
  let a: boolean = container.cradle.foo;

  let b: "bar" = container.cradle.foo;

  container = container.registerValue({ foo2: "bar2" });

  // $FlowExpectedError
  a = container.cradle.foo2;

  let b2: "bar2" = container.cradle.foo2;
}

function resolve() {
  let container = awilix.createContainer();
  let { asValue, asFunction, asClass } = awilix;

  class FooClass {}

  function fn(): 123 {
    return 123;
  }

  container = container.register({
    foo: asValue("bar"),
    inst: asClass(FooClass),
    fn: asFunction(fn)
  });

  let foo: "bar" = container.cradle.foo;
  // $FlowExpectedError
  let foo2: "bar2" = container.cradle.foo;
  let inst: FooClass = container.cradle.inst;
  // $FlowExpectedError
  let inst2: Class<FooClass> = container.cradle.inst;
  let fn2: 123 = container.cradle.fn;
  // $FlowExpectedError
  let fn3: 122 = container.cradle.fn;

  let fn4: 123 = container.resolve("fn");
  // $FlowExpectedError
  let fn5: 124 = container.resolve("fn");
}

function build() {
  let container = awilix.createContainer();
  let asFunction = awilix.asFunction;

  let t: true = container.build(() => true);

  // $FlowExpectedError
  let f: true = container.build(() => false);

  // $FlowExpectedError
  t = container.build(true);

  class Foo {}

  let f2: Foo = container.build(Foo);
}
