### 服务测试

TestBed

TestBed.configureTestingModule() 方法接收一个元数据对象，其中具有 @NgModule 中的绝大多数属性。

```js
let service: ValueService;

beforeEach(() => {
  TestBed.configureTestingModule({ providers: [ValueService] });
});

it('should use ValueService', () => {
  service = TestBed.get(ValueService);
  expect(service.getValue()).toBe('real value');
});
```

也可以使用spy来创建监听函数：

```js
const spy = jasmine.createSpyObj('ValueService', ['getValue']);

TestBed.configureTestingModule({
  // Provide both the service-to-test and its (spy) dependency
  providers: [
    MasterService,
    { provide: ValueService, useValue: spy }
  ]
});
```

### 测试HTTP服务


### 测试组件

独立组件

该组件类没有依赖。 要测试一个没有依赖的服务，你会用 new 来创建它，调用它的 API，然后对它的公开状态进行断言。 

```js
const comp = new LightswitchComponent();
expect(comp.isOn).toBe(false, 'off at first');
```

存在依赖


组件绑定

变更检测相关：

在产品阶段，当 Angular 创建组件、用户输入或者异步动作（比如 AJAX）完成时，会自动触发变更检测。  

TestBed.createComponent 不会主动触发变更检测。

使用fixture.detectChanges() 来主动执行变更检测。

此外使用ComponentFixtureAutoDetect服务商可以自动检测变更。
```js
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
TestBed.configureTestingModule({
  declarations: [ BannerComponent ],
  providers: [
    { provide: ComponentFixtureAutoDetect, useValue: true }
  ]
});
```

不过AutoDetect只对异步行为，例如Promise、计时器、DOM事件作出处理，直接修改组件的属性不会触发变更检测。

```js
it('should display updated title after detectChanges', () => {
  comp.title = 'Test Title';
  fixture.detectChanges(); // detect changes explicitly
  expect(h1.textContent).toContain(comp.title);
});
```

> 即使是在不需要的时候，频繁调用 detectChanges() 也没有任何坏处。

模拟用户输入值：
```js
// dispatch a DOM event so that Angular learns of input value change.
nameInput.dispatchEvent(newEvent('input'));

// Tell Angular to update the display binding through the title pipe
fixture.detectChanges();
```